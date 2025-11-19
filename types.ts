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
  withdrawn?: boolean; // New flag to check if this money has been "cashed out" from the piggy bank
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

export interface Withdrawal {
  id: string;
  amount: number;
  date: string;
  month: string;
  timestamp: number;
}