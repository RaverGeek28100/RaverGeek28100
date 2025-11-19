export enum JobType {
  SHORT = 'Short Estandar',
  LONG = 'Video Largo',
  CUSTOM = 'Personalizado'
}

export interface Job {
  id: string;
  clientName: string;
  title: string;
  type: JobType;
  amount: number;
  date: string; // ISO string
  timestamp: number;
  status: 'pending' | 'paid';
}

export interface ClientPreset {
  id: string;
  name: string;
  defaultShortPrice: number;
  defaultLongPrice: number;
}

export interface LevelData {
  level: number;
  rankTitle: string;
  minXp: number;
  maxXp: number;
}