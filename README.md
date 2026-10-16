# Vasanth Kumar Portfolio

A responsive two-page portfolio for Vasanth Kumar, an engineering graduate interested in AI and machine learning. The Home page contains About, Projects, Experience and Contact; `/projects` contains the complete project catalogue.

## Technologies

React, TypeScript, Vite, React Router, CSS, and Lucide React. The site is frontend-only: the contact and assistant services intentionally return a not-configured status until a backend is connected.

## Install, run and build

```bash
npm install
npm run dev
npm run build
```

## Structure

- `src/data/` — all editable profile, education, experience, project and interface copy.
- `src/routes/` — the Home and Projects pages.
- `src/components/` — layout, home sections, project cards/carousel, shared UI and chatbot UI.
- `src/services/` — the two integration boundaries for chat and contact delivery.
- `src/styles/` — shared design tokens and global responsive styles.
- `public/images/` — owner-supplied imagery.

## Editing content and assets

Images are imported from `src/images/`: `header_profile_image.jpg`, `About_Profilr_image.jpg`, `ESU-Net_img-1.png`, `ESU-Net_img-2.png`, `ESU-Net_img-3.png`, `FinBot_img-1.png`, `FinBot_img-2.png`, `ViT-3DRL_gif-1.gif`, `ViT-3DRL_img-1.png`, `EUREKA_img-1.png`, `EUREKA_img-2.png`, `AudiSense_img-1.png`, `AudiSense_img-2.png`, and the four `live-in-labs_img-*` files. Missing files intentionally render labeled placeholders. Add future project images to `src/data/projects.ts`.

Edit biography and profile links in `src/data/profile.ts`; education in `src/data/education.ts`; experience and its optional `viewMoreHref` in `src/data/experience.ts`; and all project content, filters, images and links in `src/data/projects.ts`. The resume button opens the supplied Google Drive URL. LinkedIn, GitHub and email are configured in `src/data/profile.ts`; project links are configured in `src/data/projects.ts`.

## Chatbot integration

The UI lives in `src/components/chatbot/` and conversation state is kept in memory in `ChatbotWidget`. The exact integration boundary is `src/services/chatService.ts`:

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

Connect your backend request in `sendMessage`. Put system prompts and prompt engineering on the backend, retrieve portfolio material in the RAG layer, and trim/store conversation history in the backend memory layer. Never put provider API keys in frontend code. Contact delivery is the same idea in `src/services/contactService.ts`.

For Netlify, `public/_redirects` handles SPA routes. Other hosts need an equivalent rewrite of all unknown paths to `index.html`.

## Implemented

- Responsive Home and Projects routes with active navigation and hash scrolling.
- About/education flow, resume availability check, project filters, reusable local carousels, experience bento, validated contact form and independent chatbot interface.
- Accessible labels, focus states, reduced-motion support, responsive mobile menu and placeholder-safe imagery.

## Still needs your input

- Real profile, portrait, experience and project images.
- Resume PDF, email, LinkedIn URL, GitHub URL and project URLs.
- A backend for contact submission and the assistant API, including prompts, RAG and conversational memory.
- Optional experience “View more” destination.
