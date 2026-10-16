// Vercel serverless function for the portfolio chatbot.
// Accepts POST requests, validates input, resolves context, calls OpenAI,
// and returns the assistant reply. The API key stays server-side only.
//
// In-memory rate limiting is per-instance only and is NOT a complete
// distributed abuse-prevention solution — each Vercel instance keeps its
// own counter. For production-grade limiting, use Upstash Redis or similar.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import {
  projectsData,
  experienceData,
  profileData,
  educationData,
  findEntityByText,
  findProjectById,
  findExperienceById,
  validSectionIds,
  getEntityInfo,
  getPortfolioOverview,
  allEntityNames,
  type ProjectData,
  type ExperienceData,
  type InfoPart,
} from '../src/chatbot/portfolio-data.js';
import {
  systemPrompt,
  contextPrompts,
  sectionContextMap,
} from '../src/chatbot/prompts.js';

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_MESSAGE_LENGTH = 500;
const MAX_BODY_BYTES = 10_000;
const MAX_HISTORY_EXCHANGES = 3;
const MAX_OUTPUT_TOKENS = 500;
const REQUEST_TIMEOUT_MS = 25_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const VALID_HOVER_TYPES = ['project', 'experience'] as const;
const VALID_HISTORY_ROLES = ['user', 'assistant'] as const;

const ALL_PARTS: InfoPart[] = ['summary', 'problems', 'results'];

const PROBLEM_KEYWORDS = ['problem', 'challenge', 'limitation', 'difficulty', 'difficult', 'issue', 'struggle', 'obstacle'];
const RESULTS_KEYWORDS = ['result', 'accuracy', 'metric', 'performance', 'evaluation', 'evaluate', 'benchmark', 'score', 'outcome'];
const DETAIL_KEYWORDS = ['detailed', 'in depth', 'in-depth', 'everything', 'full', 'explain fully', 'all about', 'complete', 'comprehensive'];
const INTRO_KEYWORDS = ['tell me about', 'what is', 'what are', 'what was', 'describe', 'explain', 'about', 'overview', 'summary', 'summarize'];
const PROJECT_TOPIC_KEYWORDS = ['project', 'work', 'build', 'built', 'made', 'created', 'developed', 'designed', 'research', 'model', 'system', 'application', 'app', 'assistant', 'architecture'];

const BROAD_OVERVIEW_KEYWORDS = [
  'projects', 'work', 'skills', 'technologies', 'tech stack', 'tools',
  'experience', 'background', 'built', 'worked on', 'what do you do',
  'tell me about yourself', 'tell me about him', 'ai projects',
];

const OWNER_REFERENCE_WORDS = ['he', 'his', 'vasanth', 'you', 'your'];

const TOOL_TIMEOUT_MS = 10_000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ── Rate limiting (per-instance, in-memory) ──────────────────────────────────
// NOTE: This is per-instance only. Each Vercel serverless instance keeps its
// own map. This is a best-effort deterrent, not a complete distributed solution.

const requestTimestamps = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const recent = (requestTimestamps.get(ip) ?? []).filter((t) => t > cutoff);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestTimestamps.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestTimestamps.set(ip, recent);
  return false;
}

// ── Types ────────────────────────────────────────────────────────────────────

interface HistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  message?: unknown;
  section?: unknown;
  hover?: unknown;
  history?: unknown;
}

// ── Validation helpers ───────────────────────────────────────────────────────

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function validateMessage(value: unknown): string | null {
  if (!isString(value)) return 'Message must be a string.';
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Message must not be empty.';
  if (trimmed.length > MAX_MESSAGE_LENGTH)
    return `Message must be at most ${MAX_MESSAGE_LENGTH} characters.`;
  return trimmed;
}

function validateSection(value: unknown): string | null {
  if (!isString(value)) return 'Section must be a string.';
  if (!validSectionIds.includes(value as never))
    return `Section must be one of: ${validSectionIds.join(', ')}.`;
  return value;
}

function validateHover(value: unknown): { id: string; type: string } | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'object') return null;

  const hover = value as Record<string, unknown>;
  const id = hover.id;
  const type = hover.type;

  if (!isString(id) || !isString(type)) return null;
  if (!VALID_HOVER_TYPES.includes(type as never)) return null;

  if (type === 'project' && !findProjectById(id)) return null;
  if (type === 'experience' && !findExperienceById(id)) return null;

  return { id, type };
}

interface ValidatedHistory {
  entries: HistoryEntry[];
  error: string | null;
}

function validateHistory(value: unknown): ValidatedHistory {
  if (value === null || value === undefined) return { entries: [], error: null };
  if (!Array.isArray(value)) return { entries: [], error: 'history is not an array' };

  const entries: HistoryEntry[] = [];
  let exchangeCount = 0;
  let expectingUser = true;

  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    if (typeof item !== 'object' || item === null)
      return { entries: [], error: `entry ${i} is not an object` };
    const entry = item as Record<string, unknown>;

    if (!isString(entry.role) || !VALID_HISTORY_ROLES.includes(entry.role as never))
      return { entries: [], error: `entry ${i} has invalid role` };
    if (!isString(entry.content) || entry.content.trim().length === 0)
      return { entries: [], error: `entry ${i} has empty content` };
    if (entry.content.length > MAX_MESSAGE_LENGTH)
      return { entries: [], error: `entry ${i} content exceeds max length` };

    const role = entry.role as 'user' | 'assistant';

    if (role === 'user') {
      if (!expectingUser)
        return { entries: [], error: `entry ${i}: unexpected user message (expected assistant)` };
      expectingUser = false;
    } else {
      if (expectingUser)
        return { entries: [], error: `entry ${i}: unexpected assistant message (expected user)` };
      expectingUser = true;
      exchangeCount++;
    }

    entries.push({ role, content: entry.content });
  }

  if (exchangeCount > MAX_HISTORY_EXCHANGES)
    return { entries: [], error: `too many exchanges (${exchangeCount} > ${MAX_HISTORY_EXCHANGES})` };

  return { entries, error: null };
}

// ── find_project tool for ambiguous entity resolution ────────────────────────

const findProjectToolDef = {
  type: 'function' as const,
  function: {
    name: 'find_project',
    description: 'Find the portfolio project or experience that best matches the user query. Returns the entity id or "not_found".',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The user query to match against project names, aliases, and descriptions.' },
      },
      required: ['query'],
    },
  },
};

function executeFindProject(query: string): string {
  const entity = findEntityByText(query);
  return entity ? entity.id : 'not_found';
}

async function resolveEntityWithTool(
  message: string,
  apiKey: string,
  model: string,
): Promise<ProjectData | ExperienceData | null> {
  const client = new OpenAI({ apiKey });

  const toolController = new AbortController();
  const toolTimeout = setTimeout(() => toolController.abort(), TOOL_TIMEOUT_MS);

  try {
    const useNewParam = model.startsWith('o1') || model.startsWith('o3');
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `You are an entity resolver for a portfolio chatbot. Use the find_project tool to identify which project or experience the user is asking about. Available entities: ${allEntityNames().join(', ')}. Call the tool exactly once with the user's query, then stop.`,
        },
        { role: 'user', content: message },
      ],
      tools: [findProjectToolDef],
      tool_choice: 'auto',
      ...(useNewParam
        ? { max_completion_tokens: 100 }
        : { max_tokens: 100 }),
    } as Parameters<typeof client.chat.completions.create>[0], { signal: toolController.signal }) as OpenAI.ChatCompletion;

    const toolCalls = response.choices[0]?.message?.tool_calls;
    if (!toolCalls || toolCalls.length === 0) return null;

    const call = toolCalls[0];
    if (call.type !== 'function') return null;
    if (call.function.name !== 'find_project') return null;

    let args: { query?: string };
    try {
      args = JSON.parse(call.function.arguments);
    } catch {
      return null;
    }
    if (!args.query || typeof args.query !== 'string') return null;

    const entityId = executeFindProject(args.query);
    if (entityId === 'not_found') return null;

    return findProjectById(entityId) ?? findExperienceById(entityId) ?? null;
  } finally {
    clearTimeout(toolTimeout);
  }
}

// ── Context resolution ───────────────────────────────────────────────────────

const REFERENCE_WORDS = [
  'it ',
  'its ',
  'itself',
  'this project',
  'this one',
  'that project',
  'that one',
  'the same',
  'what about it',
  'what about its',
  'how about it',
];

const COMPARISON_WORDS = [
  'compare',
  ' vs ',
  ' vs.',
  ' versus',
  'difference between',
  'better than',
  'which is better',
  'similarities',
  'differences',
];

function isComparisonQuestion(text: string): boolean {
  const lower = text.toLowerCase();
  return COMPARISON_WORDS.some((w) => lower.includes(w));
}

function isFollowUpReference(text: string): boolean {
  const lower = ` ${text.toLowerCase()} `;
  return REFERENCE_WORDS.some((w) => lower.includes(w));
}

// ── Intent → parts detection (keyword matching, no model call) ───────────────

function detectParts(message: string): InfoPart[] {
  const lower = message.toLowerCase();

  if (DETAIL_KEYWORDS.some((kw) => lower.includes(kw))) return ALL_PARTS;
  if (PROBLEM_KEYWORDS.some((kw) => lower.includes(kw))) return ['problems'];
  if (RESULTS_KEYWORDS.some((kw) => lower.includes(kw))) return ['results'];

  // Default for "tell me about X" / "what is X" / generic questions
  if (INTRO_KEYWORDS.some((kw) => lower.includes(kw))) return ['summary'];

  return ['summary'];
}

function isProjectTopicQuestion(message: string): boolean {
  const lower = message.toLowerCase();
  return PROJECT_TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
}

function isBroadOverviewQuestion(message: string): boolean {
  const lower = ` ${message.toLowerCase()} `;
  return BROAD_OVERVIEW_KEYWORDS.some((kw) => lower.includes(kw));
}

function isOwnerReference(message: string): boolean {
  const lower = ` ${message.toLowerCase()} `;
  return OWNER_REFERENCE_WORDS.some((kw) => lower.includes(` ${kw} `) || lower.includes(` ${kw}?`) || lower.includes(` ${kw}.`));
}

function findSubjectFromHistory(history: HistoryEntry[]): ProjectData | ExperienceData | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    const entity = findEntityByText(entry.content);
    if (entity) return entity;
  }
  return undefined;
}

interface ResolvedContext {
  prompt: string;
  dataBlock: string;
  needsClarification: boolean;
  clarificationMessage?: string;
}

function serializeAllProjectIntros(): string {
  return projectsData
    .map((p) => `- ${p.title} (${p.id}): ${p.intro}`)
    .join('\n');
}

function serializeEntityParts(entity: ProjectData | ExperienceData, parts: InfoPart[]): string {
  const block = getEntityInfo(entity.id, parts);
  if (!block) return '';
  const header = 'role' in entity
    ? `EXPERIENCE: ${entity.title} (id: ${entity.id})\nRole: ${entity.role}\nDates: ${entity.dates}`
    : `PROJECT: ${entity.title} (id: ${entity.id})`;
  const links = entity.links
    .map((l) => (l.href ? `${l.label}: ${l.href}` : `${l.label}: not available`))
    .join('\n');
  return `${header}\n${block}\nLinks:\n${links}`;
}

function buildClarificationMessage(): string {
  const names = allEntityNames();
  return `Which project do you mean: ${names.join(', ')}?`;
}

function serializeProfile(): string {
  return [
    `Name: ${profileData.name}`,
    `Tagline: ${profileData.tagline}`,
    `Skills: ${profileData.skills.join(', ')}`,
    `Email: ${profileData.email}`,
    `LinkedIn: ${profileData.socialLinks.linkedin}`,
    `GitHub: ${profileData.socialLinks.github}`,
    `Resume: ${profileData.resumeUrl}`,
    `Education:`,
    ...educationData.map((e) => `  - ${e.title}: ${e.detail}`),
  ].join('\n');
}

function resolveContext(
  message: string,
  section: string,
  hover: { id: string; type: string } | null,
  history: HistoryEntry[],
): ResolvedContext {
  const lowerMessage = message.toLowerCase();

  // 1. Explicit mention (deterministic match — overrides hover and section)
  const explicitEntity = findEntityByText(message);
  if (explicitEntity) {
    if (isComparisonQuestion(message)) {
      const mentioned: (ProjectData | ExperienceData)[] = [explicitEntity];
      for (const p of projectsData) {
        if (p.id !== explicitEntity.id && lowerMessage.includes(p.id.toLowerCase())) {
          mentioned.push(p);
        }
        if (p.id !== explicitEntity.id && p.aliases.some((a) => lowerMessage.includes(a.toLowerCase()))) {
          if (!mentioned.find((m) => m.id === p.id)) mentioned.push(p);
        }
      }
      const dataBlock = mentioned.map((m) =>
        serializeEntityParts(m, ALL_PARTS),
      ).join('\n\n');
      return { prompt: contextPrompts.projectComparison, dataBlock, needsClarification: false };
    }

    const parts = detectParts(message);
    const dataBlock = serializeEntityParts(explicitEntity, parts);
    const prompt = 'role' in explicitEntity
      ? contextPrompts.experienceExplicit
      : contextPrompts.projectExplicit;
    return { prompt, dataBlock, needsClarification: false };
  }

  // 2. Follow-up reference using conversation history
  if (isFollowUpReference(message)) {
    const subject = findSubjectFromHistory(history);
    if (subject) {
      const parts = detectParts(message);
      const dataBlock = serializeEntityParts(subject, parts);
      const prompt = 'role' in subject
        ? contextPrompts.experienceExplicit
        : contextPrompts.projectExplicit;
      return { prompt, dataBlock, needsClarification: false };
    }
    // Follow-up reference with no resolvable subject → ask for clarification
    return {
      prompt: '',
      dataBlock: '',
      needsClarification: true,
      clarificationMessage: buildClarificationMessage(),
    };
  }

  // 3. Hover context (hint only — never overrides an explicit question)
  if (hover && !isFollowUpReference(message)) {
    if (hover.type === 'project') {
      const project = findProjectById(hover.id);
      if (project) {
        const parts = detectParts(message);
        return {
          prompt: contextPrompts.projectHover,
          dataBlock: serializeEntityParts(project, parts),
          needsClarification: false,
        };
      }
    } else if (hover.type === 'experience') {
      const exp = findExperienceById(hover.id);
      if (exp) {
        const parts = detectParts(message);
        return {
          prompt: contextPrompts.experienceExplicit,
          dataBlock: serializeEntityParts(exp, parts),
          needsClarification: false,
        };
      }
    }
  }

  // 4. Broad overview question — answer directly from overview data, no clarification
  if (isBroadOverviewQuestion(message) || isOwnerReference(message)) {
    const overviewPrompt = section === 'projects'
      ? contextPrompts.projectsOverview
      : contextPrompts.homepage;
    return {
      prompt: overviewPrompt,
      dataBlock: getPortfolioOverview(),
      needsClarification: false,
    };
  }

  // 5. Project-topic question with no entity matched → may need tool resolution
  if (isProjectTopicQuestion(message)) {
    return {
      prompt: '',
      dataBlock: '',
      needsClarification: true,
      clarificationMessage: buildClarificationMessage(),
    };
  }

  // 6. General section context
  const sectionPrompt = sectionContextMap[section] ?? contextPrompts.homepage;

  let dataBlock: string;
  if (section === 'experience') {
    dataBlock = serializeEntityParts(experienceData, ['summary']);
  } else if (section === 'projects') {
    dataBlock = serializeAllProjectIntros();
  } else if (section === 'contact') {
    if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      return {
        prompt: contextPrompts.contactResume,
        dataBlock: serializeProfile(),
        needsClarification: false,
      };
    }
    dataBlock = serializeProfile();
  } else {
    dataBlock = serializeProfile();
  }

  return { prompt: sectionPrompt, dataBlock, needsClarification: false };
}

// ── OpenAI call ──────────────────────────────────────────────────────────────

function buildMessages(
  resolved: ResolvedContext,
  history: HistoryEntry[],
  userMessage: string,
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const systemContent = [
    systemPrompt,
    '',
    'Contextual instructions for this response:',
    resolved.prompt,
    '',
    'Verified portfolio data (use only this data, never invent information):',
    resolved.dataBlock,
  ].join('\n');

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemContent },
  ];

  for (const entry of history) {
    messages.push({ role: entry.role, content: entry.content });
  }

  messages.push({ role: 'user', content: userMessage });

  return messages;
}

interface OpenAIErrorInfo {
  name: string;
  status: number | undefined;
  code: string | undefined;
  type: string | undefined;
  isTimeout: boolean;
  isMissingKey: boolean;
}

function extractErrorInfo(error: unknown): OpenAIErrorInfo {
  const name = error instanceof Error ? error.name : 'Unknown';
  const isTimeout = name === 'AbortError' || (error instanceof Error && error.message.includes('aborted'));
  const isMissingKey = error instanceof Error && error.message.includes('OPENAI_API_KEY');

  let status: number | undefined;
  let code: string | undefined;
  let type: string | undefined;

  if (error instanceof OpenAI.APIError) {
    status = error.status;
    code = (error as unknown as { code?: string }).code;
    type = (error as unknown as { type?: string }).type;
  }

  return { name, status, code, type, isTimeout, isMissingKey };
}

function visitorMessage(info: OpenAIErrorInfo): { status: number; message: string } {
  if (info.isMissingKey) {
    return { status: 503, message: 'The assistant is temporarily unavailable.' };
  }
  if (info.isTimeout) {
    return { status: 504, message: 'The assistant took too long. Please try again.' };
  }
  if (info.status === 401 || info.code === 'invalid_api_key') {
    return { status: 503, message: 'The assistant is temporarily unavailable.' };
  }
  if (info.status === 429 || info.code === 'insufficient_quota' || info.code === 'rate_limit_exceeded') {
    return { status: 503, message: 'The assistant is temporarily unavailable.' };
  }
  if (info.status === 404 || info.code === 'model_not_found') {
    return { status: 503, message: 'The assistant is temporarily unavailable.' };
  }
  return { status: 502, message: 'The assistant could not generate a response. Please try again.' };
}

async function callOpenAI(
  resolved: ResolvedContext,
  history: HistoryEntry[],
  userMessage: string,
): Promise<string> {
  const rawKey = process.env.OPENAI_API_KEY;
  if (!rawKey || !rawKey.trim()) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }
  const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');

  const rawModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const model = rawModel.trim().replace(/^["']|["']$/g, '');

  const client = new OpenAI({ apiKey });
  const messages = buildMessages(resolved, history, userMessage);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // Models released after 2024-10 use max_completion_tokens instead of max_tokens.
    // gpt-4o-mini accepts max_tokens, but o1/o3 and some newer models reject it.
    const useNewParam = model.startsWith('o1') || model.startsWith('o3');

    const response = await client.chat.completions.create({
      model,
      messages,
      ...(useNewParam
        ? { max_completion_tokens: MAX_OUTPUT_TOKENS }
        : { max_tokens: MAX_OUTPUT_TOKENS }),
    } as Parameters<typeof client.chat.completions.create>[0], { signal: controller.signal }) as OpenAI.ChatCompletion;

    const reply = response.choices[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error('No response content from the model.');
    }
    return reply;
  } finally {
    clearTimeout(timeout);
  }
}

// ── Response helpers ─────────────────────────────────────────────────────────

function json(res: VercelResponse, status: number, body: Record<string, unknown>) {
  return res.status(status).json(body);
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0]?.trim() ?? 'unknown';
  }
  return req.socket?.remoteAddress ?? 'unknown';
}

// ── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { ...CORS_HEADERS, Allow: 'POST, OPTIONS' });
    res.end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  // Rate limiting
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return json(res, 429, { error: 'Too many requests. Please try again in a moment.' });
  }

  // Body parsing — Vercel may deliver body as a parsed object or a raw string.
  let body: ChatRequestBody;
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body) as ChatRequestBody;
    } catch {
      return json(res, 400, { error: 'Invalid JSON body.' });
    }
  } else if (req.body && typeof req.body === 'object') {
    body = req.body as ChatRequestBody;
  } else {
    return json(res, 400, { error: 'Empty request body.' });
  }

  // Body size check
  const rawBody = JSON.stringify(body);
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
    return json(res, 413, { error: 'Request body is too large.' });
  }

  // Ignore any client-supplied system prompts or project descriptions.
  // Only message, section, hover, and history are read from the body.
  const message = validateMessage(body.message);
  if (message === null) {
    return json(res, 400, { error: 'Invalid message.' });
  }

  const section = validateSection(body.section);
  if (section === null) {
    return json(res, 400, { error: 'Invalid section.' });
  }

  const hover = validateHover(body.hover);
  const historyResult = validateHistory(body.history);
  if (historyResult.error !== null) {
    console.log(`[chat] history validation failed: ${historyResult.error}`);
    return json(res, 400, { error: 'Invalid history.' });
  }
  const history = historyResult.entries;

  // Resolve context
  const resolved = resolveContext(message, section, hover, history);

  if (resolved.needsClarification) {
    // Step 2: Try one find_project tool call to resolve the entity
    const rawKey = process.env.OPENAI_API_KEY;
    if (rawKey && rawKey.trim()) {
      const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');
      const rawModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const model = rawModel.trim().replace(/^["']|["']$/g, '');

      try {
        const entity = await resolveEntityWithTool(message, apiKey, model);
        if (entity) {
          // Re-resolve with the found entity using detected parts
          const parts = detectParts(message);
          const dataBlock = serializeEntityParts(entity, parts);
          const prompt = 'role' in entity
            ? contextPrompts.experienceExplicit
            : contextPrompts.projectExplicit;
          resolved.prompt = prompt;
          resolved.dataBlock = dataBlock;
          resolved.needsClarification = false;
        }
      } catch (error) {
        const info = extractErrorInfo(error);
        console.log(`[chat] find_project tool error: name=${info.name} status=${info.status} code=${info.code} timeout=${info.isTimeout}`);
      }
    }

    if (resolved.needsClarification) {
      // Step 3: Could not resolve — ask for clarification
      return json(res, 200, {
        reply: resolved.clarificationMessage || buildClarificationMessage(),
      });
    }
  }

  // Call OpenAI
  try {
    const reply = await callOpenAI(resolved, history, message);
    return json(res, 200, { reply });
  } catch (error) {
    const info = extractErrorInfo(error);
    console.log(`[chat] openai error: name=${info.name} status=${info.status} code=${info.code} type=${info.type} timeout=${info.isTimeout} missingKey=${info.isMissingKey}`);
    const mapped = visitorMessage(info);
    return json(res, mapped.status, { error: mapped.message });
  }
}
