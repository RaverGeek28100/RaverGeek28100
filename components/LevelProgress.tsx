import React, { useMemo } from 'react';
import { LEVELS } from '../constants';
import { LevelData } from '../types';

interface LevelProgressProps {
  totalEarnings: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ totalEarnings }) => {
  const currentLevelData = useMemo((): { current: LevelData, next: LevelData | null, progress: number } => {
    const levelIndex = LEVELS.findIndex(l => totalEarnings >= l.minXp && totalEarnings < l.maxXp);
    const current = levelIndex !== -1 ? LEVELS[levelIndex] : LEVELS[LEVELS.length - 1];
    const next = levelIndex !== -1 && levelIndex < LEVELS.length - 1 ? LEVELS[levelIndex + 1] : null;
    
    let progress = 0;
    if (next) {
      const range = current.maxXp - current.minXp;
      const earnedInLevel = totalEarnings - current.minXp;
      progress = Math.min(100, Math.max(0, (earnedInLevel / range) * 100));
    } else {
      progress = 100; // Max level
    }

    return { current, next, progress };
  }, [totalEarnings]);

  const { current, next, progress } = currentLevelData;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="flex justify-between items-end mb-2 relative z-10">
        <div>
            <h3 className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Current Rank</h3>
            <h2 className="text-2xl md:text-3xl font-hud text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-bold">
                {current.rankTitle}
            </h2>
            <p className="text-slate-400 text-sm font-mono mt-1">LVL {current.level}</p>
        </div>
        <div className="text-right">
            <div className="text-3xl font-hud text-white font-bold drop-shadow-glow">
                ${totalEarnings.toLocaleString()} <span className="text-sm text-slate-500 font-sans font-normal">PTS</span>
            </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700 mt-4">
        {/* Progress Fill */}
        <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
        >
            {/* Shimmer Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>
      </div>

      <div className="flex justify-between mt-2 text-xs font-mono text-slate-400 relative z-10">
        <span>{current.minXp} XP</span>
        <span>{next ? `${Math.floor(next.minXp - totalEarnings)} XP to next rank` : 'MAX LEVEL'}</span>
        <span>{next ? next.minXp : '∞'} XP</span>
      </div>
    </div>
  );
};

export default LevelProgress;