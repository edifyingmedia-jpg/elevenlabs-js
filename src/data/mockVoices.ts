import { Voice, TTSModel, ConversationalAgent } from '../types';

export const MOCK_VOICES: Voice[] = [
  {
    id: 'rachel-v1',
    name: 'Rachel',
    category: 'Narrative',
    description: 'Calming, refined, and authentic female voice. Perfect for audiobooks, meditation, and storytelling.',
    gender: 'Female',
    age: 'Young',
    accent: 'American',
    language: 'English (US)',
    previewText: 'Welcome to AppNyormal. Speech synthesis has evolved into true human expressiveness.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tags: ['Calm', 'Narrative', 'Warm', 'Audiobook'],
    useCase: 'Audiobooks & Meditation',
    rating: 4.9,
    featured: true,
    parameters: { stability: 50, clarity: 75, styleExaggeration: 25, speakerBoost: true }
  },
  {
    id: 'adam-v1',
    name: 'Adam',
    category: 'Conversational',
    description: 'Deep, engaging male voice with clear resonance and confident pacing.',
    gender: 'Male',
    age: 'Middle Aged',
    accent: 'American',
    language: 'English (US)',
    previewText: 'If you can dream it, you can express it. Discover the next frontier of AI voice design.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tags: ['Deep', 'Conversational', 'Tech', 'Podcast'],
    useCase: 'Podcasts & Explainer Videos',
    rating: 4.95,
    featured: true,
    parameters: { stability: 60, clarity: 80, styleExaggeration: 15, speakerBoost: true }
  },
  {
    id: 'antoni-v1',
    name: 'Antoni',
    category: 'Narrative',
    description: 'Well-modulated male voice with subtle European warmth and clear articulation.',
    gender: 'Male',
    age: 'Young',
    accent: 'European / Polish',
    language: 'Multilingual (English, Polish, Spanish)',
    previewText: 'Precision audio generation with emotional depth and natural breath pauses.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tags: ['Modulated', 'Expressive', 'Global'],
    useCase: 'Documentaries & Education',
    rating: 4.85,
    featured: true,
    parameters: { stability: 45, clarity: 85, styleExaggeration: 30, speakerBoost: true }
  },
  {
    id: 'domi-v1',
    name: 'Domi',
    category: 'Social Media',
    description: 'Energetic, crisp female voice with strong presence for commercials and TikTok shorts.',
    gender: 'Female',
    age: 'Young',
    accent: 'American',
    language: 'English (US)',
    previewText: 'Hey everyone! Check out this incredible new AI tool that turns text into studio audio instantly.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tags: ['Upbeat', 'Energetic', 'Commercial'],
    useCase: 'Shorts & Advertising',
    rating: 4.8,
    parameters: { stability: 35, clarity: 80, styleExaggeration: 50, speakerBoost: true }
  },
  {
    id: 'bella-v1',
    name: 'Bella',
    category: 'Conversational',
    description: 'Soft, friendly female voice with gentle intonation and soothing acoustic tone.',
    gender: 'Female',
    age: 'Young',
    accent: 'American',
    language: 'English (US)',
    previewText: 'Softly spoken words carry profound meaning. Experience realistic speech synthesis.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    tags: ['Soft', 'Gentle', 'Customer Care'],
    useCase: 'AI Agents & Support',
    rating: 4.88,
    parameters: { stability: 55, clarity: 70, styleExaggeration: 20, speakerBoost: true }
  },
  {
    id: 'josh-v1',
    name: 'Josh',
    category: 'News',
    description: 'Authoritative, clear broadcast male voice ideal for journalism and presentations.',
    gender: 'Male',
    age: 'Middle Aged',
    accent: 'American',
    language: 'English (US)',
    previewText: 'Reporting live from the frontier of synthetic media and machine learning breakthroughs.',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    tags: ['Broadcast', 'Authoritative', 'Clear'],
    useCase: 'News & Presentations',
    rating: 4.92,
    parameters: { stability: 70, clarity: 90, styleExaggeration: 10, speakerBoost: true }
  },
  {
    id: 'sam-v1',
    name: 'Sam',
    category: 'Conversational',
    description: 'Casual, slightly raspy male voice with natural vocal fry and conversational pacing.',
    gender: 'Male',
    age: 'Young',
    accent: 'American (West Coast)',
    language: 'English (US)',
    previewText: 'So yeah, we basically built an entire studio right inside your browser.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    tags: ['Casual', 'Raspy', 'Natural'],
    useCase: 'Gaming & Informal Clips',
    rating: 4.79,
    parameters: { stability: 40, clarity: 75, styleExaggeration: 35, speakerBoost: false }
  },
  {
    id: 'freya-v1',
    name: 'Freya',
    category: 'Animation',
    description: 'Futuristic, distinct female voice tailored for sci-fi characters and assistant interfaces.',
    gender: 'Female',
    age: 'Young',
    accent: 'British',
    language: 'English (UK)',
    previewText: 'All primary systems online. Quantum speech synthesis engine operating at peak efficiency.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    tags: ['Sci-fi', 'British', 'Polished'],
    useCase: 'Video Games & Sci-Fi UI',
    rating: 4.91,
    parameters: { stability: 65, clarity: 88, styleExaggeration: 30, speakerBoost: true }
  },
  {
    id: 'ethan-v1',
    name: 'Ethan',
    category: 'Audiobooks',
    description: 'Rich, resonant male storytelling voice built for long-form fiction and fantasy audiobooks.',
    gender: 'Male',
    age: 'Middle Aged',
    accent: 'British',
    language: 'English (UK)',
    previewText: 'The ancient gates swung open with a low groan, revealing the misty valley forgotten by time.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    tags: ['Narrative', 'Rich', 'British', 'Dramatic'],
    useCase: 'Audiobooks & Fantasy',
    rating: 4.96,
    featured: true,
    parameters: { stability: 55, clarity: 80, styleExaggeration: 40, speakerBoost: true }
  }
];

export const MOCK_MODELS: TTSModel[] = [
  {
    id: 'eleven-multilingual-v2',
    name: 'Eleven Multilingual v2',
    description: 'Most emotionally rich and expressive model. Supports 29 languages with unmatched realism.',
    latency: '~350ms',
    languagesCount: 29,
    badge: 'Recommended'
  },
  {
    id: 'eleven-turbo-v2.5',
    name: 'Eleven Turbo v2.5',
    description: 'Ultra low-latency speech model optimized for real-time applications and developer streaming.',
    latency: '~150ms',
    languagesCount: 32,
    badge: 'Ultra Fast'
  },
  {
    id: 'eleven-flash-v2.5',
    name: 'Eleven Flash v2.5',
    description: 'Blazing fast low-cost model engineered for high-throughput Conversational AI Agents.',
    latency: '~75ms',
    languagesCount: 32,
    badge: 'Lowest Latency'
  },
  {
    id: 'eleven-monolingual-v1',
    name: 'Eleven English v1',
    description: 'Classic legacy model optimized strictly for English accents and narrative inflection.',
    latency: '~300ms',
    languagesCount: 1
  }
];

export const MOCK_CONVERSATIONAL_AGENTS: ConversationalAgent[] = [
  {
    id: 'agent-customer-support',
    name: 'Sarah - Support Specialist',
    description: 'Friendly 24/7 customer service agent capable of answering FAQs and looking up orders.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    systemPrompt: 'You are Sarah, a warm and helpful customer support representative for AppNyormal. You assist users with billing queries, voice synthesis tips, and technical setup in a concise, friendly manner.',
    firstMessage: "Hi there! I'm Sarah from AppNyormal. How can I help you with your voice generation today?",
    llmModel: 'Gemini 3.7 Flash',
    voiceId: 'rachel-v1',
    voiceName: 'Rachel',
    knowledgeFiles: ['API_Docs.pdf', 'Pricing_FAQ.pdf'],
    toolsEnabled: ['Search Knowledge Base', 'Create Support Ticket']
  },
  {
    id: 'agent-sales-rep',
    name: 'Marcus - Enterprise Sales Assistant',
    description: 'Professional enterprise rep designed to qualify leads and introduce custom voice cloning tiers.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    systemPrompt: 'You are Marcus, an enterprise sales specialist. Speak confidently about custom API rate limits, dedicated Voice Lab training, and enterprise SLAs.',
    firstMessage: "Welcome to AppNyormal Enterprise. Are you looking to scale voice synthesis across your app or gaming pipeline?",
    llmModel: 'Gemini 3.7 Flash',
    voiceId: 'josh-v1',
    voiceName: 'Josh',
    knowledgeFiles: ['Enterprise_SLA.pdf'],
    toolsEnabled: ['Book Calendar Demo', 'Calculate Usage Quote']
  }
];

export const SFX_PRESETS = [
  'Cinematic thunder strike over dark ocean',
  'Futuristic laser beam charging up and firing',
  'Retro 8-bit arcade jump sound effect',
  'Sci-fi spaceship door sliding open smoothly',
  'Heavy footsteps walking on dry autumn leaves',
  'Magical chime spell cast with sparkling reverb',
  'Deep cinematic bass drop sub boom',
  'Old vintage mechanical typewriter keystrokes'
];
