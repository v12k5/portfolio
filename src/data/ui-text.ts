export const filterLabels = [
  { label: 'All', id: null },
  { label: 'Gen AI', id: 'gen-ai' },
  { label: 'Computer Vision', id: 'computer-vision' },
  { label: 'Speech', id: 'speech' },
  { label: 'Social Welfare', id: 'social-welfare' },
] as const;

export const projectsPage = {
  heading: 'Projects', subtitle: 'Things I’ve built to understand how machines see, hear, and decide.',
  technical: { heading: 'Technical Projects', subtitle: 'AI systems across vision, language, speech and prediction' },
  socialWelfare: { heading: 'Social Welfare', subtitle: 'Technology with people at the center' },
  cta: { line1: 'Like what you see?', line2: 'Let’s build something.', text: 'For a thoughtful hello, a research conversation, or a project with an intelligent edge.', button: 'Get in touch' },
  empty: 'No projects in this category yet.',
};

export const contactText = {
  heading: 'Let’s build something', intro: 'For a thoughtful hello, a research conversation, or a project with an intelligent edge.',
  labels: { name: 'Name', email: 'Email', message: 'Message' },
  placeholders: { name: 'Your name', email: 'you@example.com', message: 'What’s on your mind?' }, button: 'Send message',
  errors: { name: 'Please enter your name.', emailMissing: 'Please enter your email address.', emailInvalid: 'Please enter a valid email address.', message: 'Please write a message.' },
  sent: 'Thanks, your message was sent.', notConfigured: 'Message sending isn’t connected yet, so nothing was sent. Please use the Email link on the left for now.', failed: 'Something went wrong and your message wasn’t sent. Please try again.',
};

export const chatText = { title: 'Chat with Vasanth', status: 'Ask me about my work.', welcome: 'Hi! I’m Vasanth. Ask me about my projects, experience, or technical interests.', prompts: ['What technologies do you work with?', 'Tell me about your AI projects.', 'What’s your background?', 'How can I get in touch?'], inputPlaceholder: 'Type your message…', notConfigured: 'I’m not connected yet. Your message wasn’t sent anywhere.' };
