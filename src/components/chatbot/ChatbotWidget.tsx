import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Info, Send, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { chatText } from '@/data/ui-text';
import { sendMessage, type ChatMessage, type ChatHistoryEntry } from '@/services/chatService';
import { useActiveSection } from '@/hooks/useActiveSection';

const MAX_HISTORY_EXCHANGES = 3;
const HOVER_DEBOUNCE_MS = 150;

type HoverContext = { id: string; type: string } | null;

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: chatText.welcome, createdAt: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const activeSection = useActiveSection();
  const location = useLocation();
  const section = location.pathname === '/projects' ? 'projects' : activeSection;
  const hoverRef = useRef<HoverContext>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track hover context via event delegation. Hover never triggers an API call.
  useEffect(() => {
    const findHoverTarget = (target: EventTarget | null): HoverContext => {
      if (!(target instanceof Element)) return null;
      const projectEl = target.closest<HTMLElement>('[data-project-id]');
      if (projectEl) {
        return { id: projectEl.dataset.projectId!, type: 'project' };
      }
      const expEl = target.closest<HTMLElement>('[data-element-type="experience"]');
      if (expEl) {
        return { id: expEl.dataset.elementId!, type: 'experience' };
      }
      return null;
    };

    const onHoverEnter = (event: MouseEvent) => {
      if (!open) return;
      const ctx = findHoverTarget(event.target);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = setTimeout(() => {
        hoverRef.current = ctx;
      }, HOVER_DEBOUNCE_MS);
    };

    const onHoverLeave = (event: MouseEvent) => {
      if (!open) return;
      const ctx = findHoverTarget(event.target);
      if (ctx) {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => {
          hoverRef.current = null;
        }, HOVER_DEBOUNCE_MS);
      }
    };

    document.addEventListener('mouseover', onHoverEnter);
    document.addEventListener('mouseout', onHoverLeave);
    return () => {
      document.removeEventListener('mouseover', onHoverEnter);
      document.removeEventListener('mouseout', onHoverLeave);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else buttonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending]);

  useEffect(() => {
    const esc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) setOpen(false);
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);

  const buildHistory = useCallback((msgs: ChatMessage[]): ChatHistoryEntry[] => {
    // Collect only user/assistant messages (skip welcome + system), in pairs
    const conversational = msgs.filter(
      (m) => m.id !== 'welcome' && (m.role === 'user' || m.role === 'assistant'),
    );
    // Remove the trailing user message if there's no matching assistant reply yet
    if (conversational.length > 0 && conversational[conversational.length - 1].role === 'user') {
      conversational.pop();
    }
    // Keep only the last MAX_HISTORY_EXCHANGES completed exchanges
    const completed = conversational.filter((m) => m.role !== undefined);
    const maxEntries = MAX_HISTORY_EXCHANGES * 2;
    const trimmed = completed.slice(-maxEntries);
    return trimmed.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
  }, []);

  const send = async (text = input) => {
    const content = text.trim();
    if (!content || pending) return;

    const user: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: Date.now(),
    };
    // Snapshot messages before adding the user message for history construction
    const history = buildHistory([...messages, user]);

    setMessages((current) => [...current, user]);
    setInput('');
    setPending(true);

    const result = await sendMessage(
      {
        section: section,
        hover: hoverRef.current,
        history,
      },
      content,
    );

    setPending(false);

    if (result.status === 'ok') {
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: result.reply, createdAt: Date.now() },
      ]);
    } else {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'system',
          content: result.status === 'not_configured' ? chatText.notConfigured : result.message,
          createdAt: Date.now(),
        },
      ]);
    }
  };

  return (
    <div className="chatbot">
      <button
        ref={buttonRef}
        className="chat-button"
        type="button"
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        aria-controls="portfolio-chat"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Bot />}
      </button>
      {open && (
        <section className="chat-window" id="portfolio-chat" aria-label="Chat with Vasanth">
          <header>
            <div>
              <strong>{chatText.title}</strong>
              <span>{chatText.status}</span>
            </div>
            <button type="button" aria-label="Close chat" onClick={() => setOpen(false)}>
              <X />
            </button>
          </header>
          <div className="chat-log" role="log" aria-live="polite" ref={logRef}>
            {messages.map((message) => (
              <div className={`chat-message chat-message--${message.role}`} key={message.id}>
                {message.role === 'system' && <Info />}
                <span>{message.content}</span>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="prompt-chips">
                {chatText.prompts.map((prompt) => (
                  <button type="button" key={prompt} onClick={() => send(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            {pending && (
              <div className="typing">
                <i />
                <i />
                <i />
              </div>
            )}
          </div>
          <form
            className="chat-input"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              placeholder={chatText.inputPlaceholder}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  send();
                }
              }}
            />
            <button type="submit" aria-label="Send message" disabled={!input.trim() || pending}>
              <Send />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
