import React from 'react';
import { Job } from '../types';
import { Trash2, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface JobHistoryProps {
  jobs: Job[];
  onDelete: (id: string) => void;
}

const JobHistory: React.FC<JobHistoryProps> = ({ jobs, onDelete }) => {
  if (jobs.length === 0) {
    return (
        <div className="text-center py-12">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <p className="font-bold text-slate-400 text-lg">No hay misiones registradas aún.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div 
          key={job.id} 
          className={`
            bg-white border-2 rounded-2xl p-4 flex justify-between items-center transition-all hover:shadow-sm
            ${job.status === 'pending' ? 'border-orange-200' : 'border-slate-100'}
          `}
        >
          <div className="flex-1">
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
                  ) : (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-full bg-green-100 text-green-600 uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3" /> Pagado
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
          
          <div className="flex items-center gap-4">
              <div className="text-right">
                  <span className={`block text-xl font-black ${job.status === 'pending' ? 'text-orange-400' : 'text-slate-300'}`}>
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
  );
};

export default JobHistory;