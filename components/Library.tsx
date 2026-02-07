import React from 'react';
import { RISK_RULES } from '../constants';

const Library: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h2 className="text-5xl font-[900] text-white tracking-tight uppercase leading-tight italic">Intelligence Core</h2>
          <div className="flex items-center gap-3">
             <span className="w-8 h-[2px] bg-sky-500 rounded-full"></span>
             <p className="text-[10px] font-black text-sky-500/60 uppercase tracking-[0.4em]">WISDOM IS THE BEST RISK MANAGEMENT.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RISK_RULES.map((rule) => (
          <div key={rule.id} className="group relative bg-slate-900/40 border border-white/[0.05] p-10 rounded-[3rem] transition-all cursor-pointer overflow-hidden min-h-[320px] glass">
            <div className="absolute -top-4 -right-4 w-40 h-40 bg-sky-600/5 rounded-full blur-3xl group-hover:bg-sky-600/20 transition-all duration-700"></div>
            <div className="text-6xl mb-8 transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">{rule.icon}</div>
            <span className="inline-block px-4 py-1.5 bg-slate-950 text-sky-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl mb-6 border border-white/[0.05]">
              {rule.category}
            </span>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase italic">{rule.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200 transition-colors font-medium">{rule.content}</p>
          </div>
        ))}
      </div>

      <div className="relative group overflow-hidden bg-white/[0.02] border border-white/[0.05] p-12 rounded-[4rem] glass">
        <div className="absolute top-0 right-0 p-32 bg-sky-500/5 blur-[120px] pointer-events-none"></div>
        <h3 className="text-3xl font-black mb-10 text-white flex items-center gap-5 italic uppercase tracking-tight">
           <span className="w-1.5 h-10 bg-sky-500 rounded-full"></span>
           Pre-Flight Synapse Check
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {[
            "Logic check: Is this FOMO or verified Strategy?",
            "Risk check: Am I mentally prepared for this loss?",
            "Market check: High-impact news expected soon?",
            "Physical check: Am I tired, impulsive, or emotional?"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 glass p-8 rounded-[2.5rem] hover:bg-white/[0.05] transition-all border border-white/[0.03]">
              <span className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/[0.08] flex items-center justify-center text-sky-400 text-base font-black shadow-inner">
                {idx + 1}
              </span>
              <span className="text-slate-300 font-bold text-lg">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;