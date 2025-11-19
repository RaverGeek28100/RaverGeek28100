import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter } from 'react-router-dom';
import { LayoutDashboard, History, Star, Users } from 'lucide-react';
import { getJobs, saveJob, deleteJob, getGoal, markClientJobsAsPaid } from './services/storage';
import { Job } from './types';
import GoalTracker from './components/GoalTracker';
import AddJobForm from './components/AddJobForm';
import JobHistory from './components/JobHistory';
import ClientStats from './components/ClientStats';
import AICoach from './components/AICoach';
import { playClickSound } from './services/sound';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [goal, setGoal] = useState<number>(5000);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'clients'>('dashboard');

  useEffect(() => {
    setJobs(getJobs());
    setGoal(getGoal());
  }, []);

  const handleAddJob = (job: Job) => {
    const updated = saveJob(job);
    setJobs(updated);
  };

  const handleDeleteJob = (id: string) => {
    // Removed confirm for instant delete
    const updated = deleteJob(id);
    setJobs(updated);
  };

  const handleMarkPaid = (clientName: string) => {
      const updated = markClientJobsAsPaid(clientName);
      setJobs(updated);
  };

  const handleTabChange = (tab: 'dashboard' | 'history' | 'clients') => {
      setActiveTab(tab);
      playClickSound();
  }

  // Split earnings into Liquid (Paid) and Pending (Debt)
  const paidEarnings = useMemo(() => jobs.filter(j => j.status === 'paid').reduce((sum, job) => sum + job.amount, 0), [jobs]);
  const pendingEarnings = useMemo(() => jobs.filter(j => j.status === 'pending').reduce((sum, job) => sum + job.amount, 0), [jobs]);
  const totalEarnings = paidEarnings + pendingEarnings;

  return (
    <HashRouter>
        <div className="min-h-screen bg-slate-50 pb-24 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Top Navigation Bar - Clean White */}
            <nav className="bg-white border-b-2 border-slate-200 sticky top-0 z-50">
                <div className="max-w-xl mx-auto px-4 py-4 flex justify-center items-center">
                    <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        <span className="font-extrabold text-2xl tracking-tight text-slate-700">
                            Video<span className="text-blue-500">Quest</span>
                        </span>
                    </div>
                </div>
            </nav>

            <main className="max-w-xl mx-auto px-4 py-6">
                
                {/* Goal Tracker: Now handles the visual separation of Paid vs Pending */}
                <GoalTracker 
                    totalEarnings={totalEarnings} 
                    paidEarnings={paidEarnings}
                    pendingEarnings={pendingEarnings}
                    initialGoal={goal} 
                />
                
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 bg-slate-200 p-1.5 rounded-2xl overflow-x-auto">
                    <button
                        onClick={() => handleTabChange('dashboard')}
                        className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-3 text-xs md:text-sm font-extrabold rounded-xl transition-all whitespace-nowrap ${
                            activeTab === 'dashboard' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
                        Misiones
                    </button>
                    <button
                        onClick={() => handleTabChange('clients')}
                        className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-3 text-xs md:text-sm font-extrabold rounded-xl transition-all whitespace-nowrap ${
                            activeTab === 'clients' 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Users className="w-4 h-4 md:w-5 md:h-5" />
                        Clientes
                    </button>
                    <button
                        onClick={() => handleTabChange('history')}
                        className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-3 text-xs md:text-sm font-extrabold rounded-xl transition-all whitespace-nowrap ${
                            activeTab === 'history' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <History className="w-4 h-4 md:w-5 md:h-5" />
                        Historial
                    </button>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'dashboard' && (
                        <>
                            <AddJobForm onJobAdded={handleAddJob} />
                            <AICoach totalEarnings={totalEarnings} lastJob={jobs[0]} />
                        </>
                    )}

                    {activeTab === 'clients' && (
                        <ClientStats jobs={jobs} onMarkPaid={handleMarkPaid} />
                    )}

                    {activeTab === 'history' && (
                        <JobHistory jobs={jobs} onDelete={handleDeleteJob} />
                    )}
                </div>

            </main>
            
            <footer className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest pb-8">
                <p>Autoguardado Activo • Diseño Minimalista</p>
            </footer>
        </div>
    </HashRouter>
  );
};

export default App;