import React, { useState } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { Job, LevelData } from '../types';
import { getMotivationalQuote } from '../services/geminiService';
import { LEVELS } from '../constants';

interface AICoachProps {
  totalEarnings: number;
  lastJob?: Job;
}

const AICoach: React.FC<AICoachProps> = ({ totalEarnings, lastJob }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetMotivation = async () => {
    setLoading(true);
    const level = LEVELS.find(l => totalEarnings >= l.minXp && totalEarnings < l.maxXp) || LEVELS[LEVELS.length - 1];
    const quote = await getMotivationalQuote(totalEarnings, level, lastJob);
    setMessage(quote);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-1 border border-cyan-900/50 shadow-lg mt-6">
        <div className="bg-slate-900/80 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-hud text-cyan-100 text-lg">AI Coach System</h3>
            </div>

            {message ? (
                <div className="bg-cyan-950/30 border border-cyan-900/50 p-4 rounded-lg animate-in fade-in duration-500">
                    <p className="text-cyan-200 italic font-mono text-sm leading-relaxed">
                        "{message}"
                    </p>
                    <button 
                        onClick={() => setMessage(null)}
                        className="text-xs text-slate-500 mt-2 hover:text-cyan-400 transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            ) : (
                <div className="text-center py-2">
                    <button
                        onClick={handleGetMotivation}
                        disabled={loading}
                        className={`
                            w-full group relative overflow-hidden rounded-lg bg-cyan-700 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-cyan-600
                            ${loading ? 'opacity-75 cursor-wait' : ''}
                        `}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <>Processing Data...</>
                            ) : (
                                <>
                                    <MessageSquare className="w-4 h-4" />
                                    Analyze Performance & Motivate
                                </>
                            )}
                        </span>
                        {/* Button Glow Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default AICoach;