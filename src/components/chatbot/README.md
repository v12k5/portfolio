# Chatbot

`ChatbotWidget.tsx` owns the interface-only conversation, open/close behavior, prompt chips, keyboard input and notices. It imports the text model and `services/chatService.ts` only.

```
Chat UI
   ↓
chatService.sendMessage()
   ↓
Future backend/API (your own server; never call a model provider from the browser)
   ↓
Prompt construction + retrieval (RAG) + conversational memory + model call
   ↓
Assistant response
   ↓
Chat UI
```

Add the backend request in `src/services/chatService.ts`; put prompts, RAG retrieval and memory on that backend.
