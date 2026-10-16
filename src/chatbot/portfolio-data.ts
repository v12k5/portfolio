// Manually editable: structured portfolio data for the chatbot backend.
// Only fields verified from the existing repository are filled in.
// Missing details are marked as TODO and must never be presented as facts.

export interface ProjectData {
  id: string;
  title: string;
  aliases: string[];
  intro: string;
  overview: string;
  problem: string;
  architecture: string;
  technologies: string[];
  contribution: string;
  results: string;
  limitations: string;
  links: { label: string; href: string | null }[];
}

export interface ExperienceData {
  id: string;
  title: string;
  aliases: string[];
  role: string;
  dates: string;
  intro: string;
  overview: string;
  problem: string;
  architecture: string;
  technologies: string[];
  contribution: string;
  results: string;
  limitations: string;
  links: { label: string; href: string }[];
}

export interface EducationEntry {
  id: string;
  title: string;
  detail: string;
}

export interface ProfileData {
  name: string;
  tagline: string;
  skills: string[];
  resumeUrl: string;
  email: string;
  socialLinks: { linkedin: string; github: string };
  aboutParagraphs: string[];
}

export const profileData: ProfileData = {
  name: 'Vasanth Kumar',
  tagline: 'Building intelligent solutions. Fueled by curiosity and a passion for solving meaningful problems.',
  skills: [
    'Machine Learning',
    'Deep Learning',
    'Spiking Neural Networks',
    'Generative AI',
    'Computer Vision',
    'Reinforcement Learning',
    'Speech Enhancement',
    'Human-Centered Design',
  ],
  resumeUrl: 'https://drive.google.com/file/d/1a4x2exhtS6hAUWe944n3YiUmEWGpb57w/view?usp=sharing',
  email: 'pvkvarma5@gmail.com',
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/pvkvarma5/',
    github: 'https://github.com/v12k5/',
  },
  aboutParagraphs: [
    'I always felt intimidated by computers and programming, but with practice, that fear gradually turned into an interest in programming and problem-solving. The rapid growth of AI during my engineering years sparked my curiosity to understand how machines learn and how AI can solve real-world problems.',
    'I’ve worked on projects across machine learning, deep learning, spiking neural networks, and generative AI. Through these projects and my internship, I’ve gained hands-on experience in designing AI models, experimenting with architectures, and improving their efficiency.',
    'Beyond technology, I value the opportunity to understand people and solve problems that matter to them. My experience with Live-in Labs introduced me to human-centered problem-solving, where understanding people’s needs is the starting point for designing meaningful solutions.',
    'Having completed my engineering degree, I’m open to opportunities in AI and ML engineering where I can contribute my skills, take on new challenges, and continue growing in the field.',
  ],
};

export const educationData: EducationEntry[] = [
  { id: 'secondary', title: 'Secondary Education (CBSE)', detail: 'Sri Prakash Vidya Niketan · 2020' },
  { id: 'intermediate', title: 'Intermediate Education (State Board)', detail: 'FIITJEE · 2020–2022' },
  { id: 'btech', title: 'B.Tech — Electronics & Computer Engineering', detail: 'Amrita Vishwa Vidyapeetham · 2022–2026 · CGPA: 8.49' },
];

// Internship: ESU-Net
export const experienceData: ExperienceData = {
  id: 'esu-net',
  title: 'ESU-Net',
  aliases: ['ESU-Net', 'Efficient Spiking U-Net', 'ESU Net', 'spiking U-Net'],
  role: 'AI Intern',
  dates: 'January 2026 to June 2026',
  intro: 'Lightweight hybrid Spiking Neural Network–Convolutional Neural Network (SNN-CNN) for image denoising; designed to balance reconstruction quality and computational efficiency.',
  overview: 'Removes Gaussian, Poisson, and salt-and-pepper noise from images; preserves structural details and color information; reduces model parameters and computational complexity using selective spiking neurons and lightweight convolutions.',
  problem: 'Balancing image reconstruction quality with low computational cost; addressing information loss and reduced pixel-level accuracy caused by spiking neuron discretization; determining where to integrate LIF neurons without degrading image quality; preserving edges, fine details, and color information while reducing model complexity.',
  architecture: 'U-Net encoder-decoder with skip connections; selective Leaky Integrate-and-Fire (LIF) neurons across encoder stages D1–D5 and decoder stages U1–U4; depthwise separable convolutions, residual blocks, spatial and channel attention; temporal averaging across timesteps; composite reconstruction loss.',
  technologies: [
    'Spiking Neural Networks (SNN)',
    'CNN',
    'Selective LIF Neurons',
    'Depthwise Separable Convolutions',
    'Residual Connections',
    'Attention Mechanisms',
    'Image Denoising',
  ],
  contribution:
    'Identified the research gap in balancing reconstruction quality and computational cost in spiking image denoising; designed and implemented the ESU-Net architecture; integrated selective LIF neurons and lightweight convolutional blocks; trained and evaluated the model; compared reconstruction quality and computational complexity against existing models.',
  results: '0.326M parameters; 5.0 GMACs; approximately 10.04 GFLOPs with LIF neurons at T=1; approximately 27% lower computational cost than the non-LIF variant; BSD68 SSIM of 0.8566 at Gaussian noise σ=15; Urban100 SSIM of 0.7885 at σ=15; comparable structural preservation with lower PSNR than leading conventional denoising models.',
  limitations: 'Lower PSNR than conventional deep-learning denoisers; some loss of sharpness and slight blurring; spike discretization limits pixel-level reconstruction accuracy; future work includes Total Variation loss to reduce artifacts and deployment testing on Raspberry Pi 4 and low-power edge devices.',
  links: [
    {
      label: 'GitHub',
      href: 'https://github.com/amritamindbrain/Student-Projects/tree/main/Efficient%20Spiking%20U-Net%20for%20Image%20Denoising',
    },
  ],
};


export const projectsData: ProjectData[] = [
  // finbot project
  {
    id: 'finbot',
    title: 'FinBot: AI-Powered Banking Assistant',
    aliases: ['FinBot', 'FinBot banking assistant', 'AI banking assistant'],
    intro: 'FinBot — a domain-tuned, LLM-based financial conversational assistant with hybrid RAG, multilingual interaction, and multi-tier memory.',
    overview: 'Banking assistance through text, voice, and email; bank-specific answers using live web scraping and Pinecone-based retrieval; personalized multi-session conversations using short-term and long-term memory.',
    problem: 'Existing banking chatbots lacked contextual understanding, dynamic financial knowledge, multilingual support, and persistent memory; challenges included balancing response accuracy and latency, integrating bank-specific retrieval with general financial reasoning, isolating data across banks, and maintaining context across sessions.',
    architecture: 'LoRA-fine-tuned DistilBERT classifies user intent; 4-bit QLoRA-quantized Mistral-7B generates responses; hybrid RAG combines live bank-website scraping and Pinecone vector search; Mem0AI manages short-term and long-term memory with PostgreSQL; Retell AI supports voice interactions; escalation workflows handle email or human support.',
    technologies: ['LLM', 'QLoRA', 'DistilBERT', 'Mistral 7B', 'RAG', 'Pinecone', 'Conversational Memory'],
    contribution: 'Designed the AI system architecture; fine-tuned DistilBERT and Mistral-7B models; implemented Pinecone-based RAG and hybrid retrieval; deployed models to the cloud and configured API endpoints; contributed to Retell AI voice integration.',
    results: 'DistilBERT validation loss decreased from 1.0584 (epoch 1) to 0.1010 (epoch 4); LoRA trained 887,811 of 67.8 million parameters (1.31%); hybrid RAG achieved 0.70 Precision@5; LLM-as-a-Judge evaluation achieved 9/10; paper reports over 90% reduction in memory-token consumption and 91% reduction in latency.',
    limitations: 'Retrieval may produce partial matches for rare or multi-intent queries; expand real-time data sources; improve feedback-driven model adaptation; strengthen production-scale deployment, compliance, and privacy protection.',
    links: [{ label: 'GitHub', href: 'https://github.com/v12k5/FinBot1' }],
  },

  // ViT-3DRL Project
  {
    id: 'vit-3drl',
    title: 'ViT-3DRL',
    aliases: ['ViT-3DRL', 'ViT 3DRL', 'visual reinforcement learning', '3D navigation agent'],
    intro: 'Lightweight Vision Transformer (ViT) for sample-efficient, goal-conditioned 3D visual navigation.',
    overview: 'Two-stage learning pipeline separating visual representation learning from policy training; learns viewpoint-invariant scene features through contrastive pretraining; navigates toward target locations using goal images.',
    problem: 'Pixel-based reinforcement learning requires extensive environment interactions; challenges include viewpoint changes, sparse rewards, and learning spatially useful visual representations.',
    architecture: 'Random exploration generates unlabeled RGB frames; compact ViT encoder pretrained using SimCLR-style contrastive learning; pretrained encoder frozen; current and goal images encoded into 128-dimensional embeddings; PPO policy predicts navigation actions using embedding pairs and distance-based rewards.',
    technologies: ['Vision Transformer (ViT)', 'PPO', 'Contrastive Learning', '3D Navigation', 'MiniWorld'],
    contribution: 'Designed the two-stage model architecture; trained the ViT encoder using self-supervised contrastive learning; implemented PPO-based goal-conditioned navigation; prepared exploration data and configured the simulation environment; TODO: confirm individual implementation responsibilities.',
    results: '80% navigation success rate; End-to-End PPO: 52%; CURL PPO: 71%; Random ViT + PPO: 55%; approximately 2,000 training episodes; ViT encoder: 2.1M parameters and 4.2 GFLOPs per forward pass; contrastive pretraining: 3.2 hours.',
    limitations: '1.8× higher computational cost than the CNN-based CURL baseline; 2.1× more parameters; evaluation restricted to MiniWorld-OneRoom-v0 and 20 test episodes; future work: multi-room environments, more efficient ViT variants, transfer learning, and real-robot deployment.',
    links: [{ label: 'GitHub', href: 'https://github.com/v12k5/ViT-3DRL' }],
  },
  
  // Eureka Project
  {
    id: 'eureka',
    title: 'EUREKA',
    aliases: ['EUREKA', 'assistive vision system', 'Eureka'],
    intro: 'I built EUREKA (Enhanced User Real-time Environmental Knowledge Assistance), an assistive vision system designed to help visually impaired users understand indoor environments.',
    overview: 'I developed a modular system that combines real-time object detection, object tracking, spatial awareness, text recognition, and voice-driven navigation guidance. I designed the workflow to keep core perception running continuously while activating OCR only when requested, reducing unnecessary computation.',
    problem: 'Conventional convolutional downsampling can discard fine edges and textures needed to detect small indoor objects. I addressed this by integrating Haar wavelet decomposition into YOLOv11n, preserving both coarse structural features and high-frequency details. I also separated continuous perception from on-demand OCR to avoid unnecessary processing and addressed channel-dimension mismatches in the wavelet modules.',
    architecture: 'I integrated a wavelet-enhanced YOLOv11n model for indoor object detection and ByteTrack for tracking objects across frames. I implemented an on-demand PaddleOCR pipeline for text detection and multilingual recognition. I also developed spatial reasoning, voice-command processing, and simulated navigation guidance using detected objects and their positions. Monocular depth estimation is identified as a potential extension.',
    technologies: ['YOLO', 'YOLOv11n', 'ByteTrack', 'OCR', 'Wavelet Enhancement', 'Computer Vision'],
    contribution: 'I designed the overall system architecture, prepared the dataset, and trained and evaluated the object detection models. I integrated object tracking and spatial awareness, developed the OCR and text-recognition pipeline, and implemented voice-command processing and simulated navigation guidance.',
    results: 'The wavelet-enhanced YOLOv11n model improved mAP@50 from 0.54 to 0.65 and mAP@50–95 from 0.34 to 0.45, with faster and more stable training convergence.',
    limitations: 'Navigation guidance remains simulated, and speech synthesis is not yet integrated. Monocular depth estimation, low-power hardware deployment, and improved temporal stability remain future work.',
    links: [{ label: 'GitHub', href: 'https://github.com/v12k5/EUREKA' }],
  },

  // stock-price-prediction Project
  {
    id: 'stock-price-prediction',
    title: 'Stock Price Prediction',
    aliases: ['Stock Price Prediction', 'stock prediction', 'Random Forest stock'],
    intro: 'A stock price prediction model using Random Forest on historical NSE data with exploratory data analysis.',
    overview:
      'Implemented a stock price prediction model using Random Forest, leveraging exploratory data analysis (EDA) and historical NSE data to identify patterns and estimate price movements.',
    problem: 'TODO: add details',
    architecture: 'Random Forest model with EDA on historical NSE (National Stock Exchange) data.',
    technologies: ['Random Forest', 'NSE Data', 'EDA', 'Forecasting', 'Machine Learning'],
    contribution: 'TODO: add details',
    results: 'TODO: add details',
    limitations: 'TODO: add details',
    links: [{ label: 'GitHub', href: null }],
  },

  // AudiSense Project
  {
    id: 'audisense',
    title: 'AudiSense',
    aliases: ['AudiSense', 'hearing aid app', 'speech enhancement app'],
    intro: 'AudiSense; personalized noise cancellation using signal processing, deep learning–guided compressive sensing, and user-specific audio shaping',
    overview: 'Three-stage pipeline combining Wiener noise suppression, adaptive compressive sensing for efficient signal reconstruction, and personalized frequency/amplitude shaping; DL selects a sensing matrix instead of reconstructing the entire clean audio signal end-to-end',
    problem: 'Designing a computationally efficient alternative to end-to-end audio reconstruction models; balancing noise suppression, speech preservation, sparse signal reconstruction, and personalization; TODO: add details on specific implementation challenges faced',
    architecture: 'Noisy audio → STFT (8 kHz, 25 ms frames, 50% overlap) → adaptive hard thresholding (T1 = 0.3) → 15-dimensional acoustic feature extraction → 1D-CNN sensing matrix selection (80 candidates) → L1-norm reconstruction → personalized frequency/amplitude shaping → inverse STFT',
    technologies: ['1D-CNN', 'Compressive Sensing', 'Wiener Filtering', 'Audio', 'Speech Enhancement', 'Python'],
    contribution: 'Identified the research gap in computationally efficient personalized noise cancellation; designed the hybrid signal-processing and deep-learning architecture; developed the acoustic-feature-based sensing matrix selection approach; integrated sparse reconstruction and personalized audio shaping',
    results: 'STFT sampling rate: 8 kHz; frame length: 200 samples; frequency bins: 101; frame overlap: 50%; thresholding sparsity: 70–90%; sensing matrix candidates: 80; CNN training: 50 epochs, batch size 32; matrix selection based on validation PESQ; TODO: add measured PESQ scores and comparative results',
    limitations: 'Hard thresholding may remove weak speech components; L1 reconstruction requires computationally expensive optimization per frame; personalization depends on frequency and amplitude shaping parameters; TODO: add measured limitations and planned improvements',
    links: [{ label: 'GitHub', href: 'https://github.com/v12k5/AudiSense' }],
  },

  // Live-in-Labs Project
  {
    id: 'live-in-labs',
    title: 'Live-in-Labs',
    aliases: ['Live-in-Labs', 'Live in Labs', 'Uttarakhand village project', 'community co-design'],
    intro: 'Field research and co-design project in Sera Village, Uttarakhand; focused on understanding rural community challenges and developing sustainable, community-informed solutions',
    overview: 'One-week community immersion; combined Participatory Rural Appraisal (PRA) and Human-Centered Design (HCD); identified agricultural livelihood challenges, especially pest-related crop losses',
    problem: 'Gaining trust of villagers; understanding diverse community needs and prioritizing interconnected problems; limited fieldwork time, accessibility, and stakeholder availability; identifying solutions suited to local practices, resources, and financial constraints',
    architecture: 'Community immersion and observation → participant identification → village mapping and problem analysis → interviews and empathy building → problem definition → ideation and co-design → proposed experimental setup; methods included mind maps, semi-structured interviews, poster cards, and brainstorming',
    technologies: ['Human-Centered Design', 'Participatory Rural Appraisal', 'Co-Design', 'Community Engagement'],
    contribution: 'Designed the co-design methodology as part of the project team; structured community understanding, participant identification, problem definition, and collaborative ideation; incorporated participatory activities to develop solutions with villagers rather than solely for them',
    results: 'Identified pest infestation as a major agricultural challenge; approximately 25–30% of rice and wheat crops lost to pests, according to field findings; proposed an Integrated Pest Management (IPM) strategy costing ₹2,650 per acre in year one and ₹850 per acre in subsequent seasons; no measured post-implementation results reported',
    limitations: 'Short fieldwork duration; limited accessibility and stakeholder availability; proposed interventions require long-term community engagement, institutional support, and farmer training; effectiveness of the proposed IPM strategy requires field validation',
    links: [{ label: 'SSRN Paper', href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5760462' }],
  },
];

// Lookup helpers

export const allProjectsById = new Map(projectsData.map((p) => [p.id, p]));
export const allExperienceById = new Map([['esu-net', experienceData]]);

export function findProjectById(id: string): ProjectData | undefined {
  return allProjectsById.get(id);
}

export function findExperienceById(id: string): ExperienceData | undefined {
  return allExperienceById.get(id);
}

// Find a project or experience by matching IDs, titles, or aliases against a query string.
export function findEntityByText(text: string): ProjectData | ExperienceData | undefined {
  const lower = text.toLowerCase();

  for (const project of projectsData) {
    if (
      project.id.toLowerCase() === lower ||
      project.title.toLowerCase() === lower ||
      project.aliases.some((a) => a.toLowerCase() === lower)
    ) {
      return project;
    }
  }

  for (const [, exp] of allExperienceById) {
    if (
      exp.id.toLowerCase() === lower ||
      exp.title.toLowerCase() === lower ||
      exp.aliases.some((a) => a.toLowerCase() === lower)
    ) {
      return exp;
    }
  }

  // Partial matching for when the user mentions a project name within a longer sentence
  for (const project of projectsData) {
    if (project.aliases.some((a) => lower.includes(a.toLowerCase()))) {
      return project;
    }
  }

  for (const [, exp] of allExperienceById) {
    if (exp.aliases.some((a) => lower.includes(a.toLowerCase()))) {
      return exp;
    }
  }

  return undefined;
}

export const validSectionIds = ['home', 'projects', 'experience', 'contact'] as const;
export type SectionId = (typeof validSectionIds)[number];

export const validProjectIds: string[] = projectsData.map((p) => p.id);

export type InfoPart = 'summary' | 'problems' | 'results';

const TODO = 'TODO: add details';

function buildPart(
  part: InfoPart,
  entity: ProjectData | ExperienceData,
): string {
  if (part === 'summary') {
    const fields: Array<[string, string]> = [
      ['Intro', entity.intro],
      ['Overview', entity.overview],
      ['Architecture', entity.architecture],
      ['Technologies', entity.technologies.join(', ')],
      ['Contribution', entity.contribution],
    ];
    return [`[${part.toUpperCase()}`]
      .concat(fields.filter(([, v]) => v !== TODO).map(([k, v]) => `${k}: ${v}`))
      .join('\n');
  }

  if (part === 'problems') {
    const fields: Array<[string, string]> = [
      ['Problem', entity.problem],
      ['Limitations', entity.limitations],
    ];
    return [`[${part.toUpperCase()}`]
      .concat(fields.filter(([, v]) => v !== TODO).map(([k, v]) => `${k}: ${v}`))
      .join('\n');
  }

  // results
  if (entity.results === TODO) return `[${part.toUpperCase()}]`;
  return `[${part.toUpperCase()}]\nResults: ${entity.results}`;
}

export function getEntityInfo(id: string, parts: InfoPart[]): string | null {
  const entity = allProjectsById.get(id) ?? allExperienceById.get(id);
  if (!entity) return null;
  return parts.map((p) => buildPart(p, entity)).join('\n\n');
}

export function getPortfolioOverview(): string {
  const skills = `Skills: ${profileData.skills.join(', ')}`;
  const projectsBlock = projectsData
    .map((p) => `- ${p.title}: ${p.intro}`)
    .join('\n');
  const experienceBlock = `- ${experienceData.title} (${experienceData.role}, ${experienceData.dates}): ${experienceData.intro}`;
  const educationBlock = educationData
    .map((e) => `- ${e.title}: ${e.detail}`)
    .join('\n');
  return [
    skills,
    'Projects:',
    projectsBlock,
    'Experience:',
    experienceBlock,
    'Education:',
    educationBlock,
  ].join('\n');
}

export function allEntityNames(): string[] {
  return [...projectsData.map((p) => p.title), `${experienceData.title} (internship)`];
}
