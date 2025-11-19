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
  { level: 1, rankTitle: "Novice Cutter", minXp: 0, maxXp: 2000 },
  { level: 2, rankTitle: "Timeline Traveller", minXp: 2000, maxXp: 5000 },
  { level: 3, rankTitle: "Keyframe Warrior", minXp: 5000, maxXp: 10000 },
  { level: 4, rankTitle: "Render Master", minXp: 10000, maxXp: 20000 },
  { level: 5, rankTitle: "VFX Wizard", minXp: 20000, maxXp: 40000 },
  { level: 6, rankTitle: "Director of Chaos", minXp: 40000, maxXp: 75000 },
  { level: 7, rankTitle: "Legendary Editor", minXp: 75000, maxXp: 150000 },
  { level: 8, rankTitle: "God of Post-Production", minXp: 150000, maxXp: 9999999 },
];