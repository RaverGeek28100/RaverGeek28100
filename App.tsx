import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter } from 'react-router-dom';
import { LayoutDashboard, History, Trophy } from 'lucide-react';
import { getJobs, saveJob, deleteJob } from './services/storage';
import { Job } from './types';
import LevelProgress from './components/LevelProgress';
import AddJobForm from './components/AddJobForm';
import JobHistory from './components/JobHistory';
import AICoach from './components/AICoach';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  useEffect(() => {
    setJobs(getJobs());
  }, []);

  const handleAddJob = (job: Job) => {
    const updated = saveJob(job);
    setJobs(updated);
    // Sound effect could go here
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm("Are you sure you want to delete this mission record?")) {
        const updated = deleteJob(id);
        setJobs(updated);
    }
  };

  const totalEarnings = useMemo(() => jobs.reduce((sum, job) => sum + job.amount, 0), [jobs]);

  return (
    <HashRouter>
        <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
            {/* Top Navigation Bar */}
            <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
                <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 p-1.5 rounded">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-hud font-bold text-xl tracking-tight text-white">
                            VIDEO<span className="text-purple-500">QUEST</span>
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                
                {/* Always visible Level Progress */}
                <LevelProgress totalEarnings={totalEarnings} />
                
                {/* Tab Navigation */}
                <div className="flex gap-2 border-b border-slate-800 pb-1">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
                            activeTab === 'dashboard' 
                            ? 'bg-slate-800 text-white border-b-2 border-purple-500' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Active Mission
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
                            activeTab === 'history' 
                            ? 'bg-slate-800 text-white border-b-2 border-purple-500' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        <History className="w-4 h-4" />
                        Mission Log
                    </button>
                </div>

                <div className="animate-in fade-in duration-300">
                    {activeTab === 'dashboard' && (
                        <>
                            <AddJobForm onJobAdded={handleAddJob} />
                            <AICoach totalEarnings={totalEarnings} lastJob={jobs[0]} />
                        </>
                    )}

                    {activeTab === 'history' && (
                        <JobHistory jobs={jobs} onDelete={handleDeleteJob} />
                    )}
                </div>

            </main>
            
            <footer className="text-center text-slate-600 text-xs py-6 font-mono">
                <p>VIDEO QUEST v1.0 // STORAGE: LOCAL_MEMORY // <span className="text-emerald-500">AUTO-SAVE ACTIVE</span></p>
            </footer>
        </div>
    </HashRouter>
  );
};

export default App;