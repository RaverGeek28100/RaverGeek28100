import React from 'react';
import { Job } from '../types';
import { Trash2, Calendar, Clock } from 'lucide-react';

interface JobHistoryProps {
  jobs: Job[];
  onDelete: (id: string) => void;
}

const JobHistory: React.FC<JobHistoryProps> = ({ jobs, onDelete }) => {
  if (jobs.length === 0) {
    return (
        <div className="text-center py-12 opacity-50">
            <p className="font-mono text-slate-400">No missions recorded yet.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-hud font-bold text-white mb-4 border-b border-slate-700 pb-2">Mission Log</h3>
      <div className="grid gap-3">
        {jobs.map((job) => (
          <div 
            key={job.id} 
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex justify-between items-center group hover:bg-slate-800 transition-colors"
          >
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`
                        text-[10px] font-bold px-2 py-0.5 rounded uppercase
                        ${job.clientName === 'eodrizola' ? 'bg-indigo-900 text-indigo-300' : 
                          job.clientName === 'jdaniel' ? 'bg-emerald-900 text-emerald-300' : 
                          'bg-slate-700 text-slate-300'}
                    `}>
                        {job.clientName}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {job.date}
                    </span>
                </div>
                <h4 className="text-white font-medium">{job.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                   <Clock className="w-3 h-3" /> {job.type}
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <span className="block text-lg font-bold text-green-400 font-mono">
                        +{job.amount} XP
                    </span>
                </div>
                
                <button 
                    onClick={() => onDelete(job.id)}
                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Record"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobHistory;