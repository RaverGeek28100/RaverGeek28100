import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Edit2, Check, PiggyBank, Clock } from 'lucide-react';
import { saveGoal } from '../services/storage';
import { playClickSound, playGoalReachedSound } from '../services/sound';

interface GoalTrackerProps {
  totalEarnings: number;
  paidEarnings: number;
  pendingEarnings: number;
  initialGoal: number;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ totalEarnings, paidEarnings, pendingEarnings, initialGoal }) => {
  const [targetGoal, setTargetGoal] = useState(initialGoal);
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(initialGoal.toString());
  const hasCelebrated = useRef(false);

  useEffect(() => {
    setTargetGoal(initialGoal);
    setTempGoal(initialGoal.toString());
  }, [initialGoal]);

  // Progress is based on TOTAL earnings (Paid + Pending) because that's the "Level" score
  const progress = Math.min(100, Math.max(0, (totalEarnings / targetGoal) * 100));
  
  useEffect(() => {
      if (progress >= 100 && !hasCelebrated.current && totalEarnings > 0) {
          playGoalReachedSound();
          hasCelebrated.current = true;
      } else if (progress < 100) {
          hasCelebrated.current = false;
      }
  }, [progress, totalEarnings]);

  const handleSaveGoal = () => {
    const newGoal = parseInt(tempGoal, 10) || 1000;
    setTargetGoal(newGoal);
    saveGoal(newGoal);
    setIsEditing(false);
    playClickSound();
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm mb-6 relative overflow-hidden">
      
      {/* Header: Goal vs Earnings */}
      <div className="flex justify-between items-start mb-6">
        
        {/* Left: Goal Input */}
        <div>
            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Meta
            </h2>
            
            {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-extrabold text-slate-700">$</span>
                    <input 
                        type="number" 
                        value={tempGoal}
                        onChange={(e) => setTempGoal(e.target.value)}
                        className="w-24 text-xl font-extrabold text-slate-700 bg-slate-100 rounded-lg px-2 border-2 border-slate-300 focus:border-blue-500 outline-none"
                        autoFocus
                    />
                    <button 
                        onClick={handleSaveGoal}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 cursor-pointer group mt-1" onClick={() => setIsEditing(true)}>
                    <span className="text-2xl font-extrabold text-slate-700">
                        ${targetGoal.toLocaleString()}
                    </span>
                    <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
            )}
        </div>

        {/* Right: Stats Breakdown */}
        <div className="flex flex-col items-end gap-2">
             {/* Piggy Bank (Paid) */}
             <div className="flex items-center gap-2 text-pink-500 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100">
                 <PiggyBank className="w-5 h-5" />
                 <div className="text-right">
                     <span className="text-[10px] font-bold uppercase block leading-none opacity-70">Mi Cochinito</span>
                     <span className="text-xl font-black leading-none">${paidEarnings.toLocaleString()}</span>
                 </div>
             </div>

             {/* Pending (Debt) - If 0, it's greyed out/minimized */}
             <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border transition-all ${pendingEarnings > 0 ? 'text-orange-500 bg-orange-50 border-orange-100' : 'text-slate-300 bg-slate-50 border-transparent'}`}>
                 <Clock className="w-3 h-3" />
                 <div className="text-right">
                     <span className="text-[9px] font-bold uppercase block leading-none opacity-70">Por Cobrar</span>
                     <span className="text-sm font-black leading-none">${pendingEarnings.toLocaleString()}</span>
                 </div>
             </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden mb-2 border border-slate-200">
        {/* Progress Fill */}
        <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out
                ${progress >= 100 ? 'bg-yellow-400' : 'bg-blue-500'}
            `}
            style={{ width: `${progress}%` }}
        >
             <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Progreso Total</span>
          <span>{progress.toFixed(0)}%</span>
      </div>

      {progress >= 100 && (
        <div className="mt-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="inline-block bg-yellow-100 text-yellow-700 font-bold px-4 py-2 rounded-xl border-2 border-yellow-300 shadow-sm">
                🎉 ¡OBJETIVO ALCANZADO! 🎉
            </span>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;