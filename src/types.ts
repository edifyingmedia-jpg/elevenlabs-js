export type NavigationTab = 
  | 'speech-synthesis' 
  | 'voice-changer' 
  | 'sound-effects' 
  | 'text-to-video'
  | 'image-to-video'
  | 'voice-library' 
  | 'voice-lab' 
  | 'dubbing' 
  | 'conversational-ai' 
  | 'projects-studio' 
  | 'api-playground' 
  | 'pricing-plans';

export interface VoiceParameters {
  stability: number; // 0 to 100
  clarity: number; // 0 to 100
  styleExaggeration: number; // 0 to 100
  speakerBoost: boolean;
}

export interface Voice {
  id: string;
  name: string;
  category: 'Narrative' | 'Conversational' | 'Animation' | 'Characters' | 'Social Media' | 'News' | 'Audiobooks';
  description: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  age: 'Young' | 'Middle Aged' | 'Old';
  accent: string;
  language: string;
  previewText: string;
  avatarUrl?: string;
  tags: string[];
  useCase: string;
  rating: number;
  cloned?: boolean;
  featured?: boolean;
  parameters: VoiceParameters;
}

export interface TTSModel {
  id: string;
  name: string;
  description: string;
  latency: string;
  languagesCount: number;
  badge?: string;
}

export interface AudioGeneration {
  id: string;
  title: string;
  text: string;
  voiceName: string;
  voiceId: string;
  timestamp: string;
  duration: number; // in seconds
  audioUrl?: string;
  type: 'speech' | 'sfx' | 'voice_changer' | 'dubbed';
  characterCount: number;
  parameters?: VoiceParameters;
}

export interface SoundEffect {
  id: string;
  prompt: string;
  duration: number; // 0.5 - 22s
  promptInfluence: number; // 0 - 100%
  timestamp: string;
  audioUrl?: string;
}

export interface ConversationalAgent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  systemPrompt: string;
  firstMessage: string;
  llmModel: string;
  voiceId: string;
  voiceName: string;
  knowledgeFiles: string[];
  toolsEnabled: string[];
}

export interface ProjectParagraph {
  id: string;
  speakerId: string;
  voiceName: string;
  text: string;
  status: 'ready' | 'generating' | 'done';
  duration?: number;
}

export interface StudioProject {
  id: string;
  title: string;
  updatedAt: string;
  chapterCount: number;
  paragraphs: ProjectParagraph[];
  totalDuration: number;
}

export interface DubbingProject {
  id: string;
  title: string;
  sourceLang: string;
  targetLang: string;
  status: 'processing' | 'completed' | 'draft';
  timestamp: string;
  speakersCount: number;
}

export interface UserQuota {
  creditsUsed: number;
  maxCredits: number;
  planName: string;
  customVoicesCount: number;
  maxCustomVoices: number;
}

export interface VideoGeneration {
  id: string;
  prompt: string;
  style: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  cameraMotion: string;
  duration: number; // in seconds
  timestamp: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  voiceOverName?: string;
  hasAudioFX?: boolean;
  type: 'text-to-video' | 'image-to-video';
  sourceImageUrl?: string;
}
