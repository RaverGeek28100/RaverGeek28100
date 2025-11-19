import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, DollarSign, CalendarDays, Save } from 'lucide-react';
import { PRESET_CLIENTS } from '../constants';
import { Job, JobType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { playSuccessSound, playClickSound } from '../services/sound';

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

  useEffect(() => {
    const selectedPreset = PRESET_CLIENTS.find(c => c.id === client);
    if (selectedPreset) {
      if (jobType === JobType.SHORT) setAmount(selectedPreset.defaultShortPrice);
      else if (jobType === JobType.LONG) setAmount(selectedPreset.defaultLongPrice);
    } else {
       if (jobType === JobType.SHORT) setAmount(400);
       else if (jobType === JobType.LONG) setAmount(1300);
    }
  }, [client, jobType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessSound(); // Sonido de moneda/éxito

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
      status: 'pending', // Default status
    };

    onJobAdded(newJob);
    setTitle('');
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm mb-6">
      
      <h2 className="text-xl font-extrabold text-slate-700 mb-6 flex items-center gap-2">
        <span className="bg-blue-100 p-2 rounded-xl text-blue-500">
            <Plus className="w-6 h-6" />
        </span>
        Registrar Pago
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Client Selection */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Cliente</label>
          <div className="relative group">
            <select
              value={client}
              onChange={(e) => { setClient(e.target.value); playClickSound(); }}
              className="w-full bg-slate-100 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl p-4 pl-10 focus:border-blue-400 focus:bg-blue-50 outline-none appearance-none transition-colors cursor-pointer hover:bg-slate-50"
            >
              {PRESET_CLIENTS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="other">Otro Cliente</option>
            </select>
            <Briefcase className="w-5 h-5 text-slate-400 absolute left-3 top-4 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>

        {/* Custom Client Name */}
        {client === 'other' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre del Cliente</label>
            <input
              type="text"
              required
              value={customClientName}
              onChange={(e) => setCustomClientName(e.target.value)}
              className="w-full bg-slate-100 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl p-4 focus:border-blue-400 focus:bg-blue-50 outline-none"
            />
          </div>
        )}

        {/* Job Type Buttons */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Tipo de Trabajo</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[JobType.SHORT, JobType.LONG, JobType.CUSTOM].map((type) => (
                <button
                    key={type}
                    type="button"
                    onClick={() => { setJobType(type); playClickSound(); }}
                    className={`
                        flex-1 py-3 px-4 text-sm font-extrabold rounded-2xl border-b-4 transition-all active:border-b-0 active:translate-y-1
                        ${jobType === type 
                        ? 'bg-blue-500 border-blue-700 text-white shadow-lg shadow-blue-200' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}
                    `}
                >
                    {type}
                </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Título / Descripción</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Edición Gameplay..."
            className="w-full bg-slate-100 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl p-4 focus:border-blue-400 focus:bg-blue-50 outline-none"
          />
        </div>

        {/* Amount & Date Row */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Ganancia ($)</label>
                <div className="relative group">
                    <input
                    type="number"
                    required
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-100 border-2 border-slate-200 text-slate-700 font-extrabold text-lg rounded-2xl p-4 pl-10 focus:border-green-400 focus:bg-green-50 outline-none"
                    />
                    <DollarSign className="w-5 h-5 text-slate-400 absolute left-3 top-4.5 group-focus-within:text-green-500" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha</label>
                <div className="relative group">
                    <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-100 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl p-4 pl-10 focus:border-blue-400 focus:bg-blue-50 outline-none"
                    />
                    <CalendarDays className="w-5 h-5 text-slate-400 absolute left-3 top-4.5 group-focus-within:text-blue-500" />
                </div>
            </div>
        </div>

        {/* Big Submit Button */}
        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-lg py-4 rounded-2xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all shadow-lg shadow-blue-200 uppercase tracking-wide flex items-center justify-center gap-3"
          >
            <Save className="w-6 h-6" />
            Registrar Pago
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddJobForm;