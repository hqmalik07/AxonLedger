import React from 'react';

const About: React.FC = () => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <header className="flex flex-col items-center text-center space-y-6">
        <h2 className="text-6xl font-[900] text-white tracking-tight italic uppercase leading-tight">The Architect</h2>
        <div className="h-2 w-48 bg-sky-500 rounded-full shadow-[0_0_30px_rgba(14,165,233,0.6)]"></div>
      </header>

      <div className="max-w-5xl mx-auto">
        <div className="glass p-12 md:p-20 rounded-[4rem] relative overflow-hidden group border border-white/[0.08]">
          <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-sky-600/10 blur-[120px] pointer-events-none group-hover:bg-sky-600/20 transition-all duration-1000"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-16">
            <div className="w-56 h-56 rounded-[3.5rem] bg-gradient-to-br from-sky-400 to-indigo-700 flex items-center justify-center text-7xl shadow-[0_0_50px_rgba(14,165,233,0.3)] group-hover:rotate-6 transition-transform duration-1000 border border-white/20">
              ⚡
            </div>
            
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div>
                <h3 className="text-5xl font-[900] text-white tracking-tight">Hamza Qasim</h3>
                <p className="text-sky-400 font-black uppercase tracking-[0.4em] text-xs mt-4">Visionary & Synaptic Engineer</p>
              </div>
              
              <p className="text-slate-400 font-medium leading-[1.8] text-xl">
                Axon.Ledger was engineered for traders who operate at the edge of chaos. It's not just a journal—it's an extension of your central nervous system.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-6">
                <a 
                  href="https://instagram.com/hamzaqasimo7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 glass px-10 py-5 rounded-3xl hover:bg-sky-600 hover:text-white transition-all group/link border border-white/[0.05] shadow-xl"
                >
                  <span className="text-3xl">📸</span>
                  <span className="font-black text-xs uppercase tracking-[0.3em]">Connect</span>
                </a>
                <a 
                  href="https://linkedin.com/in/hamza-qasim" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 glass px-10 py-5 rounded-3xl hover:bg-sky-600 hover:text-white transition-all border border-white/[0.05] shadow-xl"
                >
                  <span className="text-3xl">💼</span>
                  <span className="font-black text-xs uppercase tracking-[0.3em]">Network</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'OS Build', value: 'Axon.LDR-2.4' },
            { label: 'Intelligence', value: 'Synaptic Flux' },
            { label: 'Tier', value: 'Institutional Alpha' }
          ].map((item, i) => (
            <div key={i} className="glass p-10 rounded-[2.5rem] text-center border border-white/[0.05] hover:border-sky-500/30 transition-colors">
              <div className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3">{item.label}</div>
              <div className="text-base font-black text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="text-center pt-12 pb-8">
        <p className="text-slate-700 text-[11px] font-black uppercase tracking-[0.8em] opacity-40 hover:opacity-100 transition-opacity cursor-default">© 2024 Axon.Ledger | Neural Command Core</p>
      </footer>
    </div>
  );
};

export default About;