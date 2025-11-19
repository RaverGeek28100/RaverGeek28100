import React, { useState, useEffect } from 'react';
import { Plus, Save, Briefcase, DollarSign, CheckCircle2 } from 'lucide-react';
import { PRESET_CLIENTS } from '../constants';
import { Job, JobType } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AddJobFormProps {
  onJobAdded: (job: Job) => void;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onJobAdded }) => {
  const [client, setClient] = useState<string>(PRESET_CLIENTS[0].id);
  const [customClientName, setCustomClientName] = useState('');
  const [jobType, setJobType] = useState<JobType>(JobType.SHORT);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Update amount when client or job type changes
  useEffect(() => {
    const selectedPreset = PRESET_CLIENTS.find(c => c.id === client);
    
    if (selectedPreset) {
      if (jobType === JobType.SHORT) setAmount(selectedPreset.defaultShortPrice);
      else if (jobType === JobType.LONG) setAmount(selectedPreset.defaultLongPrice);
      // Keep existing amount if custom, or reset if switching to custom? Let's leave it to manual edit for custom.
    } else {
        // New/Other client defaults
       if (jobType === JobType.SHORT) setAmount(400);
       else if (jobType === JobType.LONG) setAmount(1300);
    }
  }, [client, jobType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPreset = PRESET_CLIENTS.find(c => c.id === client);
    const finalClientName = selectedPreset ? selectedPreset.name : customClientName;

    if (!finalClientName) return;

    const newJob: Job = {
      id: uuidv4(),
      clientName: finalClientName,
      title: title || `${jobType} Project`,
      type: jobType,
      amount: Number(amount),
      date,
      timestamp: Date.now(),
    };

    onJobAdded(newJob);
    
    // Show saved confirmation
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
    
    // Reset some fields but keep client selected for quick entry
    setTitle('');
    // Don't reset amount/type to allow rapid entry of similar items
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg mb-6 relative overflow-hidden">
      
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-500/20 p-2 rounded-lg">
            <Plus className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-xl font-hud font-bold text-white">New Mission Log</h2>
      </div>

      {showSavedMessage && (
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900/95 z-20 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
            <div className="text-emerald-400 mb-2">
                <CheckCircle2 className="w-12 h-12 animate-bounce" />
            </div>
            <h3 className="text-2xl font-hud font-bold text-white tracking-widest">GAME SAVED</h3>
            <p className="text-slate-400 font-mono text-xs mt-1">DATA PERSISTED TO LOCAL MEMORY</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        
        {/* Client Selection */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 uppercase">Client</label>
          <div className="relative">
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-3 pl-10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none appearance-none"
            >
              {PRESET_CLIENTS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="other">Other / New Client</option>
            </select>
            <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Custom Client Name Input (Conditional) */}
        {client === 'other' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Client Name</label>
            <input
              type="text"
              required
              value={customClientName}
              onChange={(e) => setCustomClientName(e.target.value)}
              placeholder="Enter client name..."
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-3 focus:border-purple-500 outline-none"
            />
          </div>
        )}

        {/* Job Type */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 uppercase">Mission Type</label>
          <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-700">
            {[JobType.SHORT, JobType.LONG, JobType.CUSTOM].map((type) => (
                <button
                    key={type}
                    type="button"
                    onClick={() => setJobType(type)}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                        jobType === type 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                >
                    {type === JobType.SHORT ? 'SHORT' : type === JobType.LONG ? 'LONG' : 'CUSTOM'}
                </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 uppercase">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Gameplay Ep 1"
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-3 focus:border-purple-500 outline-none"
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 uppercase">Bounty (MXN)</label>
          <div className="relative">
            <input
              type="number"
              required
              min="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-3 pl-10 font-mono focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            />
            <DollarSign className="w-4 h-4 text-green-500 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400 uppercase">Completion Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-3 focus:border-purple-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-lg shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <Save className="w-5 h-5" />
            <span>REGISTER MISSION COMPLETE</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddJobForm;