export type ChatRole = 'user' | 'assistant' | 'system';
export interface ChatMessage { id: string; role: ChatRole; content: string; createdAt: number }

export interface ChatHistoryEntry { role: 'user' | 'assistant'; content: string }
export interface ChatContext {
  section: string;
  hover: { id: string; type: string } | null;
  history: ChatHistoryEntry[];
}

export type ChatResult =
  | { status: 'ok'; reply: string }
  | { status: 'not_configured' }
  | { status: 'error'; message: string };

async function parseJsonSafe(response: Response): Promise<{ error?: string; reply?: string } | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function sendMessage(
  context: ChatContext,
  userMessage: string,
): Promise<ChatResult> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        section: context.section,
        hover: context.hover,
        history: context.history,
      }),
    });

    if (response.status === 503) {
      const data = await parseJsonSafe(response);
      return {
        status: 'not_configured',
        message: data?.error || 'I’m temporarily unavailable.'
      };
    }

    if (!response.ok) {
      const data = await parseJsonSafe(response);
      return {
        status: 'error',
        message: data?.error || 'Something went wrong. Please try again.',
      };
    }

    const data = await parseJsonSafe(response);
    if (!data || !data.reply) {
      return {
        status: 'error',
        message: 'I couldn’t generate a response. Please try again.'
      };
    }
    return { status: 'ok', reply: data.reply };
  } catch {
    return {
      status: 'error',
      message: 'Could not reach me. Please try again.'
    };
  }
}
