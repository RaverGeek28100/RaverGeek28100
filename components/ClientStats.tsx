import React, { useState } from 'react';
import { Job } from '../types';
import { Users, Copy, Wallet, PiggyBank, CheckCircle2 } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../services/sound';

interface ClientStatsProps {
  jobs: Job[];
  onMarkPaid: (clientName: string) => void;
}

interface ClientData {
  totalLifetime: number;
  pendingAmount: number;
  count: number;
  jobs: Job[];
}

const ClientStats: React.FC<ClientStatsProps> = ({ jobs, onMarkPaid }) => {
  const [copiedClient, setCopiedClient] = useState<string | null>(null);

  const stats = jobs.reduce((acc, job) => {
    if (!acc[job.clientName]) {
      acc[job.clientName] = { totalLifetime: 0, pendingAmount: 0, count: 0, jobs: [] };
    }
    acc[job.clientName].totalLifetime += job.amount;
    if (job.status === 'pending') {
        acc[job.clientName].pendingAmount += job.amount;
    }
    acc[job.clientName].count += 1;
    acc[job.clientName].jobs.push(job);
    return acc;
  }, {} as Record<string, ClientData>);

  const clients = Object.entries(stats) as [string, ClientData][];

  const handleCopyInvoice = (clientName: string, data: ClientData) => {
    playClickSound();
    
    const date = new Date().toLocaleDateString('es-ES');
    const pendingJobs = data.jobs.filter(j => j.status === 'pending').sort((a,b) => b.timestamp - a.timestamp);
    
    let text = `🧾 *ESTADO DE CUENTA - ${clientName.toUpperCase()}*\nFecha: ${date}\n\n`;
    
    if (pendingJobs.length > 0) {
        text += `*PENDIENTES DE PAGO:*\n`;
        pendingJobs.forEach(job => {
            text += `• ${job.title} (${job.type}) - $${job.amount}\n`;
        });
        text += `\n💰 *TOTAL A PAGAR: $${data.pendingAmount}*\n`;
    } else {
        text += `✅ *¡Todo al día! No hay saldos pendientes.*\n`;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        setCopiedClient(clientName);
        setTimeout(() => setCopiedClient(null), 2000);
    });
  };

  const handleMarkAsPaid = (clientName: string) => {
      playSuccessSound();
      onMarkPaid(clientName);
  };

  if (clients.length === 0) {
    return (
        <div className="text-center py-12">
             <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-300" />
            </div>
            <p className="font-bold text-slate-400 text-lg">Sin clientes registrados.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {clients.map(([name, data]) => (
        <div key={name} className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:border-indigo-300 hover:shadow-md">
          
          {/* Header Card */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <div>
                <h3 className="text-xl font-extrabold text-slate-700 flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                        <Users className="w-5 h-5" />
                    </span>
                    {name}
                </h3>
                <p className="text-slate-400 font-bold text-sm mt-1 ml-1">
                    {data.count} misiones registradas
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Histórico</p>
                <span className="block text-lg font-black text-slate-300">
                    ${data.totalLifetime.toLocaleString()}
                </span>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-3">
            {data.pendingAmount > 0 ? (
                <div className="bg-orange-50 border-2 border-orange-100 rounded-xl p-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-orange-400 uppercase">Por Cobrar</p>
                        <p className="text-2xl font-black text-orange-500">${data.pendingAmount.toLocaleString()}</p>
                    </div>
                    <button 
                        onClick={() => handleMarkAsPaid(name)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs font-extrabold uppercase tracking-wide py-2 px-4 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
                    >
                        <Wallet className="w-4 h-4" />
                        Registrar Pago
                    </button>
                </div>
            ) : (
                <div className="bg-pink-50 border-2 border-pink-100 rounded-xl p-4 flex items-center justify-center gap-3 text-pink-600 animate-in zoom-in-95 duration-300">
                    <PiggyBank className="w-8 h-8 animate-bounce" />
                    <div>
                        <p className="font-black text-lg leading-none">¡Dinero en Caja!</p>
                        <p className="text-xs font-bold opacity-70">Todo cobrado a este cliente</p>
                    </div>
                </div>
            )}

            <button
                onClick={() => handleCopyInvoice(name, data)}
                className={`
                    w-full flex items-center justify-center gap-2 py-3 rounded-xl font-extrabold text-sm transition-all
                    ${copiedClient === name 
                        ? 'bg-slate-800 text-white border-b-4 border-slate-950' 
                        : 'bg-slate-100 text-slate-500 border-b-4 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'}
                `}
            >
                {copiedClient === name ? (
                    <>
                        <CheckCircle2 className="w-5 h-5" />
                        ¡Reporte Copiado!
                    </>
                ) : (
                    <>
                        <Copy className="w-5 h-5" />
                        Copiar Reporte de Cobro
                    </>
                )}
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default ClientStats;