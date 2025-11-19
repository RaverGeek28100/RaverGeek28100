import React, { useState } from 'react';
import { MessageCircleHeart, Zap } from 'lucide-react';
import { Job } from '../types';
import { getMotivationalQuote } from '../services/geminiService';
import { LEVELS } from '../constants';
import { playClickSound } from '../services/sound';

interface AICoachProps {
  totalEarnings: number;
  lastJob?: Job;
}

const AICoach: React.FC<AICoachProps> = ({ totalEarnings, lastJob }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetMotivation = async () => {
    playClickSound();
    setLoading(true);
    const level = LEVELS.find(l => totalEarnings >= l.minXp && totalEarnings < l.maxXp) || LEVELS[LEVELS.length - 1];
    const quote = await getMotivationalQuote(totalEarnings, level, lastJob);
    setMessage(quote);
    setLoading(false);
  };

  return (
    <div className="mb-8">
        {message ? (
             <div className="bg-purple-500 text-white rounded-3xl p-6 relative border-b-4 border-purple-700 animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute -top-3 -left-2 bg-white p-2 rounded-full border-4 border-purple-100 shadow-sm">
                     <MessageCircleHeart className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-lg font-bold leading-relaxed ml-4">
                    "{message}"
                </p>
                <button 
                    onClick={() => setMessage(null)}
                    className="absolute top-4 right-4 text-purple-200 hover:text-white font-bold text-xs uppercase tracking-wide"
                >
                    Cerrar
                </button>
             </div>
        ) : (
            <button
                onClick={handleGetMotivation}
                disabled={loading}
                className={`
                    w-full group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 p-4 text-slate-600 hover:border-purple-400 hover:text-purple-500 transition-all
                    ${loading ? 'opacity-75' : 'hover:shadow-md hover:-translate-y-1'}
                `}
            >
                <div className="flex items-center justify-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-xl text-purple-500">
                        <Zap className={`w-6 h-6 ${loading ? 'animate-pulse' : ''}`} />
                    </div>
                    <span className="font-extrabold text-lg">
                        {loading ? "Conectando con la IA..." : "Pedir Consejo Motivacional"}
                    </span>
                </div>
            </button>
        )}
    </div>
  );
};

export default AICoach;