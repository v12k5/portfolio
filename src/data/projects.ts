export type FilterId = 'gen-ai' | 'computer-vision' | 'speech' | 'social-welfare';
export type ProjectGroup = 'featured' | 'technical' | 'social-welfare';
export interface ProjectImage { src: string; alt: string }
export interface Project { id: string; title: string; group: ProjectGroup; filters: FilterId[]; category: string; homeOrder?: number; homeCategory?: string; shortDescription?: string; description: string; tags: string[]; images: ProjectImage[]; href: string | null }
const img = (file: string, alt: string): ProjectImage => ({ src: `/images/${file}`, alt });
export const projects: Project[] = [
  { id: 'finbot',
    title: 'FinBot: AI-Powered Banking Assistant', 
    group: 'featured', 
    filters: ['gen-ai'], 
    category: 'GenAI / NLP', 
    homeOrder: 1, 
    homeCategory: 'Generative AI banking assistant', 
    description: 'Developed a banking assistant by fine-tuning with QLoRA on both DistilBERT and Mistral 7B, and designing a Hybrid RAG pipeline with Pinecone for context-aware financial question answering.', 
    tags: ['LLM', 'RAG', 'Conversational Memory'], 
    images: [img('FinBot_img-1.png', 'FinBot image 1'), img('FinBot_img-2.png', 'FinBot image 2')], 
    href: 'https://github.com/v12k5/FinBot1' 
  },

  { id: 'vit-3drl', 
    title: 'ViT-3DRL', 
    group: 'technical', 
    filters: ['computer-vision'], 
    category: 'Reinforcement Learning', 
    homeOrder: 2, 
    homeCategory: 'Visual reinforcement learning', 
    shortDescription: 'A resource-efficient visual reinforcement learning framework that decouples contrastive pretraining from PPO policy learning to train goal-conditioned 3D navigation agents.', 
    description: 'Designed and trained a lightweight Vision Transformer (ViT) for 3D navigation using the MiniWorld environment. Implemented a two-stage pipeline: contrastive pretraining of the visual encoder, followed by PPO-based goal-conditioned navigation with a frozen encoder.', 
    tags: ['Vision Transformer', 'PPO', '3D Navigation'], 
    images: [img('ViT-3DRL_gif-1.gif', 'ViT-3DRL animated image'), img('ViT-3DRL_img-1.png', 'ViT-3DRL image 2')], 
    href: 'https://github.com/v12k5/ViT-3DRL' 
  },

  { id: 'eureka',
    title: 'EUREKA',
    group: 'technical',
    filters: ['computer-vision'],
    category: 'Computer Vision',
    homeOrder: 3,
    homeCategory: 'Computer vision pipeline',
    shortDescription: 'A real-time computer vision pipeline that integrates YOLO-based object tracking, FastDepth estimation, and Donut OCR to extract environmental intelligence and text from video feeds into a unified JSON schema.',
    description: 'Designed and implemented EUREKA, an assistive vision system integrating wavelet-enhanced YOLOv11n for object detection, ByteTrack for tracking, and on-demand OCR for text recognition, enabling real-time spatial awareness and voice-driven navigation guidance for visually impaired users.',
    tags: ['YOLO', 'Tracking', 'OCR'],
    images: [img('EUREKA_img-1.png', 'EUREKA image 1'), img('EUREKA_img-2.png', 'EUREKA image 2')],
    href: 'https://github.com/v12k5/EUREKA'
  },

  { id: 'stock-price-prediction',
    title: 'Stock Price Prediction',
    group: 'technical',
    filters: [],
    category: 'Machine Learning',
    description: 'Implemented a stock price prediction model using Random Forest, leveraging exploratory data analysis (EDA) and historical NSE data to identify patterns and estimate price movements.',
    tags: ['NSE Data', 'EDA', 'Forecasting'],
    images: [img('stock_img-1.jpg', 'Stock price prediction image 1')],
    href: null
  },

  { id: 'audisense',
    title: 'AudiSense',
    group: 'technical',
    filters: ['speech'],
    category: 'Speech Enhancement',
    shortDescription: 'A Next.js and Python-powered web application that delivers personalized speech enhancement algorithms to improve clarity and listening experiences for hearing aid users.',
    description: 'Identified a research gap in personalized noise cancellation and designed a three-stage architecture combining Wiener filtering, deep learning–guided compressive sensing for computationally efficient audio reconstruction, and personalized frequency and amplitude shaping, avoiding the need for an end-to-end neural network to reconstruct the entire clean audio signal.',
    tags: ['CNN', 'Compressive Sensing', 'Audio'],
    images: [img('AudiSense_img-1.png', 'AudiSense image 1'), img('AudiSense_img-2.png', 'AudiSense image 2')],
    href: 'https://github.com/v12k5/AudiSense'
  },

  { id: 'live-in-labs',
    title: 'Live-in-Labs',
    subtitle: 'From Community Insights to Co-Designed Solutions',
    group: 'social-welfare',
    filters: ['social-welfare'],
    category: 'Leadership Initiative · Uttarakhand',
    description: 'Visited a village in Uttarakhand as part of a team project to understand the community. Used Participatory Rural Appraisal (PRA) and Human-Centered Design (HCD) techniques to analyse and identify key community problems, then designed a co-design methodology to develop sustainable solutions together with the villagers.',
    tags: ['Human-centered design', 'Agriculture', 'Community'],
    images: [img('live-in-labs_img-1.jpeg', 'Live-in-Labs image 1'), img('live-in-labs_img-2.png', 'Live-in-Labs image 2'), img('live-in-labs_img-3.png', 'Live-in-Labs image 3'), img('live-in-labs_img-4.jpg', 'Live-in-Labs image 4')],
    href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5760462'
  },

];
