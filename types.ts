
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export enum AppView {
  HOME = 'home',
  EDUCATION = 'education',
  ASSESSMENT = 'assessment',
  SELF_ASSESSMENT = 'self_assessment',
  CHAT = 'chat'
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  category: 'knowledge' | 'behavior';
  activity?: string;
  title?: string;
}

export interface AssessmentResult {
  score: number;
  total: number;
  feedback: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
