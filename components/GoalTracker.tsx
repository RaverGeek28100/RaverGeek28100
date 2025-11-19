import React, { useState, useEffect } from 'react';
import { Trophy, Edit2, Check } from 'lucide-react';
import { saveGoal } from '../services/storage';
import { playClickSound } from '../services/sound';

interface GoalTrackerProps {
  totalEarnings: number;
  initialGoal: number;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ totalEarnings, initialGoal }) => {
  const [targetGoal, setTargetGoal] = useState(initialGoal);
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(initialGoal.toString());

  useEffect(() => {
    setTargetGoal(initialGoal);
    setTempGoal(initialGoal.toString());
  }, [initialGoal]);

  const progress = Math.min(100, Math.max(0, (totalEarnings / targetGoal) * 100));
  
  const handleSaveGoal = () => {
    const newGoal = parseInt(tempGoal, 10) || 1000;
    setTargetGoal(newGoal);
    saveGoal(newGoal);
    setIsEditing(false);
    playClickSound();
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm mb-6 relative overflow-hidden">
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
            <div className="bg-yellow-400 rounded-2xl p-3 border-b-4 border-yellow-600">
                <Trophy className="w-8 h-8 text-yellow-900" />
            </div>
            <div>
                <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Meta Actual</h2>
                
                {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-extrabold text-slate-700">$</span>
                        <input 
                            type="number" 
                            value={tempGoal}
                            onChange={(e) => setTempGoal(e.target.value)}
                            className="w-32 text-2xl font-extrabold text-slate-700 bg-slate-100 rounded-lg px-2 border-2 border-slate-300 focus:border-blue-500 outline-none"
                            autoFocus
                        />
                        <button 
                            onClick={handleSaveGoal}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            <Check className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsEditing(true)}>
                        <span className="text-3xl font-extrabold text-slate-700">
                            ${targetGoal.toLocaleString()}
                        </span>
                        <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                )}
            </div>
        </div>

        <div className="text-right">
             <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Acumulado</h2>
             <span className="text-3xl font-extrabold text-green-500">
                ${totalEarnings.toLocaleString()}
             </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-8 bg-slate-200 rounded-2xl overflow-hidden">
        {/* Progress Fill */}
        <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-2xl transition-all duration-1000 ease-out border-b-4 border-green-600/20"
            style={{ width: `${progress}%` }}
        >
             <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
             {/* Shine line */}
             <div className="absolute top-0 right-0 h-full w-2 bg-white/30 skew-x-[-20deg]"></div>
        </div>
        
        {/* Text inside bar */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-sm font-black text-slate-700/50 drop-shadow-sm tracking-wider">
                {progress.toFixed(1)}% COMPLETADO
            </span>
        </div>
      </div>

      {progress >= 100 && (
        <div className="mt-4 text-center animate-bounce">
            <span className="bg-yellow-100 text-yellow-700 font-bold px-4 py-2 rounded-xl border-2 border-yellow-300">
                🎉 ¡OBJETIVO ALCANZADO! 🎉
            </span>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;