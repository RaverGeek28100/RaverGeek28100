import { ClientPreset, LevelData } from './types';

export const PRESET_CLIENTS: ClientPreset[] = [
  {
    id: 'eodrizola',
    name: 'eodrizola',
    defaultShortPrice: 400,
    defaultLongPrice: 1300,
  },
  {
    id: 'jdaniel',
    name: 'jdaniel',
    defaultShortPrice: 400,
    defaultLongPrice: 1300, // Assuming same pricing structure, adjustable by user
  }
];

export const LEVELS: LevelData[] = [
  { level: 1, rankTitle: "Novato de Premiere", minXp: 0, maxXp: 1000 },
  { level: 2, rankTitle: "Cortador Rápido", minXp: 1000, maxXp: 2500 },
  { level: 3, rankTitle: "Maestro del Keyframe", minXp: 2500, maxXp: 5000 },
  { level: 4, rankTitle: "Renderizador", minXp: 5000, maxXp: 10000 },
  { level: 5, rankTitle: "Mago de VFX", minXp: 10000, maxXp: 20000 },
  { level: 6, rankTitle: "Director de Caos", minXp: 20000, maxXp: 50000 },
  { level: 7, rankTitle: "Editor Legendario", minXp: 50000, maxXp: 100000 },
  { level: 8, rankTitle: "Dios del After Effects", minXp: 100000, maxXp: 9999999 },
];