
import React, { useState, useEffect, useRef } from 'react';
import { PiggyBank, Clock, CheckCircle2, Edit2, Check, X, Briefcase, Vault } from 'lucide-react';
import { playGoalReachedSound, playClickSound, playDepositSound, playCashOutSound } from '../services/sound';

interface GoalTrackerProps {
  totalEarnings: number; // Used for total score
  paidEarnings: number;  // Piggy Bank
  pendingEarnings: number; // Used for Progress Bar (Debt)
  currentGoal: number;
  onUpdateGoal: (newGoal: number) => void;
  onWithdraw: () => void;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ 
    paidEarnings, 
    pendingEarnings, 
    currentGoal, 
    onUpdateGoal,
    onWithdraw
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(currentGoal.toString());
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  
  // Animation states
  const [newlyPaidAmount, setNewlyPaidAmount] = useState<number | null>(null);
  
  // Refs for tracking changes
  const prevPendingRef = useRef(pendingEarnings);
  const prevPaidRef = useRef(paidEarnings);

  // Progress Bar Logic: Tracks PENDING (Debt) vs Goal
  const progressPercent = Math.min(100, Math.max(0, (pendingEarnings / currentGoal) * 100));
  const isGoalReached = pendingEarnings >= currentGoal && currentGoal > 0;

  // Effect to play sound ONLY when we cross the threshold (Goal Reached)
  useEffect(() => {
    if (isGoalReached && prevPendingRef.current < currentGoal) {
        playGoalReachedSound();
    }
    prevPendingRef.current = pendingEarnings;
  }, [pendingEarnings, currentGoal, isGoalReached]);

  // Effect to trigger "Paid" Animation (Piggy Bank Celebration)
  useEffect(() => {
      // Only trigger if paid earnings increased and it wasn't a reset to 0 (Withdrawal)
      if (paidEarnings > prevPaidRef.current) {
          const diff = paidEarnings - prevPaidRef.current;
          setNewlyPaidAmount(diff);
          
          // Play special deposit sound
          playDepositSound();

          // Reset animation after 2 seconds
          const timer = setTimeout(() => {
              setNewlyPaidAmount(null);
          }, 2000);
          
          return () => clearTimeout(timer);
      }
      prevPaidRef.current = paidEarnings;
  }, [paidEarnings]);

  const handleSaveGoal = () => {
    const val = parseInt(tempGoal, 10);
    if (!isNaN(val) && val > 0) {
        onUpdateGoal(val);
        setIsEditing(false);
    }
  };

  const handleWithdrawClick = () => {
      playClickSound();
      setShowWithdrawConfirm(true);
  }

  const confirmWithdraw = () => {
      playCashOutSound();
      setShowWithdrawConfirm(false);
      onWithdraw();
  }

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm mb-6 relative overflow-visible z-10">
      
      {/* TOP SECTION: JUST THE WALLET (Cleaned up) */}
      <div className="flex justify-between items-start mb-6 relative">
         
         {/* Left Side: Title or Empty */}
         <div></div>

         {/* Right Side: Wallet & Withdraw */}
         <div className="flex flex-col items-end gap-2">
             {/* Floating Animation for New Money */}
            {newlyPaidAmount && (
                <div className="absolute -top-8 right-0 animate-[bounce_1s_infinite] z-50 pointer-events-none">
                    <span className="bg-green-500 text-white font-black text-lg px-3 py-1 rounded-full shadow-lg border-2 border-green-400 flex items-center gap-1">
                        +${newlyPaidAmount.toLocaleString()}
                    </span>
                </div>
            )}

            <div className={`
                bg-pink-50 px-4 py-2 rounded-2xl border flex items-center gap-3 transition-all duration-500
                ${newlyPaidAmount ? 'border-pink-400 scale-110 shadow-lg shadow-pink-200 ring-4 ring-pink-100' : 'border-pink-100'}
            `}>
                <div className={`
                    bg-pink-100 p-2 rounded-full transition-transform duration-500
                    ${newlyPaidAmount ? 'rotate-12 scale-110 bg-pink-200' : ''}
                `}>
                    <PiggyBank className={`w-5 h-5 text-pink-500 ${newlyPaidAmount ? 'animate-bounce' : ''}`} />
                </div>
                <div className="text-right">
                    <span className="block text-[10px] font-extrabold text-pink-400 uppercase tracking-widest">
                        Dinero Cobrado (Score)
                    </span>
                    <span className={`
                        block text-2xl font-black text-slate-800 tracking-tight leading-none transition-colors duration-300
                        ${newlyPaidAmount ? 'text-pink-600' : ''}
                    `}>
                        ${paidEarnings.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Withdraw Button - Only show if there is money */}
            {paidEarnings > 0 && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    {showWithdrawConfirm ? (
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                            <button 
                                onClick={confirmWithdraw}
                                className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" /> Confirmar
                            </button>
                            <button 
                                onClick={() => setShowWithdrawConfirm(false)}
                                className="bg-slate-300 text-slate-500 px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-400"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleWithdrawClick}
                            className="group flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                        >
                            <Vault className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                            <span className="text-xs font-extrabold text-slate-400 group-hover:text-emerald-600 uppercase tracking-wide">
                                Retirar Todo
                            </span>
                        </button>
                    )}
                </div>
            )}
         </div>
      </div>

      {/* MIDDLE: PENDING ACCUMULATOR BAR */}
      <div className="mb-6">
          <div className="flex justify-between items-end text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span className="text-orange-500 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Acumulado por Cobrar
              </span>
              
              {/* Goal Editor */}
              <div className="flex items-center gap-2">
                {isEditing ? (
                    <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                        <input 
                            type="number" 
                            value={tempGoal}
                            onChange={(e) => setTempGoal(e.target.value)}
                            className="w-20 bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 text-right font-bold text-slate-700 focus:outline-none focus:border-orange-500 text-xs"
                            autoFocus
                        />
                        <button onClick={handleSaveGoal} className="bg-green-500 text-white p-1 rounded-md hover:bg-green-600">
                            <Check className="w-3 h-3" />
                        </button>
                        <button onClick={() => { setIsEditing(false); setTempGoal(currentGoal.toString()); }} className="bg-red-400 text-white p-1 rounded-md hover:bg-red-500">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 group cursor-pointer" onClick={() => { setIsEditing(true); playClickSound(); }}>
                        <span>Meta: ${currentGoal.toLocaleString()}</span>
                        <Edit2 className="w-3 h-3 text-slate-300 group-hover:text-orange-400" />
                    </div>
                )}
              </div>
          </div>

          {/* Bar Container */}
          <div className={`relative h-8 bg-slate-100 rounded-full overflow-hidden border-2 ${isGoalReached ? 'border-orange-300 ring-2 ring-orange-100' : 'border-slate-200'}`}>
            {/* The Bar (Orange for Pending/Debt) */}
            <div 
                className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out flex items-center justify-end pr-3
                    ${isGoalReached ? 'bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400' : 'bg-gradient-to-r from-orange-300 to-orange-400'}
                `}
                style={{ width: `${progressPercent}%` }}
            >
                 {progressPercent > 15 && (
                     <span className="text-xs font-black text-white drop-shadow-md shadow-black">
                        ${pendingEarnings.toLocaleString()}
                     </span>
                 )}
                 
                 {/* Shiny effect if goal reached */}
                 {isGoalReached && (
                     <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                 )}
            </div>
          </div>
      </div>

      {/* BOTTOM: STATUS INDICATOR */}
      <div className={`
        rounded-2xl p-4 border-2 transition-all duration-300
        ${pendingEarnings > 0 
            ? 'bg-orange-50 border-orange-100' 
            : 'bg-slate-50 border-slate-100'}
      `}>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`
                    p-2 rounded-xl
                    ${pendingEarnings > 0 ? 'bg-orange-200 text-orange-600' : 'bg-slate-200 text-slate-500'}
                `}>
                    {pendingEarnings > 0 ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                    <p className={`text-[10px] font-extrabold uppercase tracking-widest ${pendingEarnings > 0 ? 'text-orange-400' : 'text-slate-400'}`}>
                        {pendingEarnings > 0 ? 'Misiones Activas' : 'Todo Despejado'}
                    </p>
                    {pendingEarnings > 0 ? (
                        <p className="text-xs text-slate-500 font-bold">
                            {isGoalReached 
                                ? "¡META ALCANZADA! COBRA AHORA." 
                                : "Sigue sumando trabajos para llenar la barra."}
                        </p>
                    ) : (
                        <p className="text-xs text-slate-400 font-bold">
                            Agrega trabajos para llenar la barra.
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default GoalTracker;