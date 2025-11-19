import React, { useState } from 'react';
import { Job, Withdrawal } from '../types';
import { Trash2, Calendar, Clock, CheckCircle2, Vault, ArrowRight } from 'lucide-react';
import { playClickSound } from '../services/sound';

interface JobHistoryProps {
  jobs: Job[];
  withdrawals: Withdrawal[];
  onDelete: (id: string) => void;
}

const JobHistory: React.FC<JobHistoryProps> = ({ jobs, withdrawals, onDelete }) => {
  const [view, setView] = useState<'jobs' | 'withdrawals'>('jobs');

  const toggleView = (v: 'jobs' | 'withdrawals') => {
      playClickSound();
      setView(v);
  }

  if (jobs.length === 0 && withdrawals.length === 0) {
    return (
        <div className="text-center py-12">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <p className="font-bold text-slate-400 text-lg">No hay registros aún.</p>
        </div>
    );
  }

  return (
    <div>
        {/* Mini Toggle */}
        <div className="flex justify-center mb-6">
            <div className="bg-slate-200 p-1 rounded-xl inline-flex">
                <button
                    onClick={() => toggleView('jobs')}
                    className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${view === 'jobs' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Misiones
                </button>
                <button
                    onClick={() => toggleView('withdrawals')}
                    className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${view === 'withdrawals' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Retiros (Banco)
                </button>
            </div>
        </div>

        {view === 'jobs' ? (
            <div className="space-y-4">
            {jobs.map((job) => (
                <div 
                key={job.id} 
                className={`
                    bg-white border-2 rounded-2xl p-4 flex justify-between items-center transition-all hover:shadow-sm relative overflow-hidden
                    ${job.status === 'pending' ? 'border-orange-200' : job.withdrawn ? 'border-slate-100 opacity-75' : 'border-green-100'}
                `}
                >
                <div className="flex-1 z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`
                            text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide
                            ${job.clientName === 'eodrizola' ? 'bg-indigo-100 text-indigo-600' : 
                                job.clientName === 'jdaniel' ? 'bg-emerald-100 text-emerald-600' : 
                                'bg-slate-100 text-slate-500'}
                        `}>
                            {job.clientName}
                        </span>
                        
                        {job.status === 'pending' ? (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-full bg-orange-100 text-orange-600 uppercase tracking-wide">
                                <Clock className="w-3 h-3" /> Pendiente
                            </span>
                        ) : job.withdrawn ? (
                             <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide">
                                <Vault className="w-3 h-3" /> Retirado
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-full bg-green-100 text-green-600 uppercase tracking-wide">
                                <CheckCircle2 className="w-3 h-3" /> En Caja
                            </span>
                        )}
                    </div>
                    <h4 className="text-slate-700 font-extrabold text-lg">{job.title}</h4>
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">
                            {job.type}
                        </p>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-bold text-slate-400">
                            {job.date}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 z-10">
                    <div className="text-right">
                        <span className={`block text-xl font-black ${job.status === 'pending' ? 'text-orange-400' : job.withdrawn ? 'text-slate-300' : 'text-green-400'}`}>
                            +${job.amount}
                        </span>
                    </div>
                    
                    <button 
                        onClick={() => onDelete(job.id)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Eliminar Registro"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="space-y-4">
                {withdrawals.length === 0 && (
                    <div className="text-center py-8 text-slate-400 font-bold text-sm">
                        No has hecho ningún retiro aún.
                    </div>
                )}
                {withdrawals.map((wd) => (
                    <div key={wd.id} className="bg-slate-50 border-2 border-emerald-100 rounded-2xl p-5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                                <Vault className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                                    RETIRO COMPLETADO
                                </p>
                                <p className="text-slate-700 font-extrabold text-lg">
                                    {wd.month}
                                </p>
                                <p className="text-xs text-slate-400 font-bold">
                                    {wd.date}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-emerald-500">
                                ${wd.amount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default JobHistory;