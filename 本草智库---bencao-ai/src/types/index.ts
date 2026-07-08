
export interface User {
  id: string;
  username: string;
  avatar: string;
  role: 'admin' | 'user';
  registeredAt?: string;
}

export interface Herb {
  id: number;
  name: string;
  pinyin: string;
  category: string;
  nature: string;
  channels: string[];
  description: string;
  efficacy: string;
  usage: string;
  contraindications: string;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  timestamp?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

export type ConstitutionType = 
  | '平和质' | '气虚质' | '阳虚质' | '阴虚质' | '痰湿质' 
  | '湿热质' | '血瘀质' | '气郁质' | '特禀质';

export interface TestResult {
  id: string;
  username: string;
  result: ConstitutionType;
  date: string;
}

export type PageView = 'login' | 'dashboard' | 'search' | 'recommendation' | 'test' | 'users' | 'methodology';
