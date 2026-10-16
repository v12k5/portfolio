export const profile = {
  name: 'Vasanth Kumar',
  avatar: { 
    src: '/images/header_profile_image.jpg', 
    alt: 'Portrait of Vasanth Kumar' 
  },
  resumeUrl: 'https://drive.google.com/file/d/1a4x2exhtS6hAUWe944n3YiUmEWGpb57w/view?usp=sharing',
  email: 'pvkvarma5@gmail.com',
  socialLinks: { linkedin: 'https://www.linkedin.com/in/pvkvarma5/', github: 'https://github.com/v12k5/' },
  nav: [{ label: 'Home', to: '/' }, { label: 'Project', to: '/projects' }, { label: 'Experience', to: '/#experience' }, { label: 'Contact', to: '/#contact' }],
  about: {
    heading: 'Building intelligent solutions.',
    subheading: 'Fueled by curiosity and a passion for solving meaningful problems.',
    portrait: { 
      src: '/images/About_Profile_image.jpg', 
      alt: 'Portrait of Vasanth Kumar' 
    },
    paragraphs: [
      'I always felt intimidated by computers and programming, but with practice, that fear gradually turned into an interest in programming and problem-solving. The rapid growth of AI during my engineering years sparked my curiosity to understand how machines learn and how AI can solve real-world problems.',
      'I’ve worked on projects across machine learning, deep learning, spiking neural networks, and generative AI. Through these projects and my internship, I’ve gained hands-on experience in designing AI models, experimenting with architectures, and improving their efficiency.',
      'Beyond technology, I value the opportunity to understand people and solve problems that matter to them. My experience with Live-in Labs introduced me to human-centered problem-solving, where understanding people’s needs is the starting point for designing meaningful solutions.',
      'Having completed my engineering degree, I’m open to opportunities in AI and ML engineering where I can contribute my skills, take on new challenges, and continue growing in the field.'
    ],
  },
} as const;
