import React, { useState, useEffect } from 'react';
import Journal from './components/Journal';
import Analytics from './components/Analytics';
import Library from './components/Library';
import About from './components/About';
import Calculator from './components/Calculator';
import { Trade } from './types';
import { formatCurrency } from './utils/formatters';

enum Tab {
  LEDGER = 'Ledger',
  CALC = 'Calc',
  PULSE = 'Pulse',
  INTEL = 'Intel',
  NODE = 'Node'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LEDGER);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('axon_trades');
    if (saved) {
      setTrades(JSON.parse(saved));
    } else {
      const initial = [{
        id: 'init-1',
        date: new Date().toISOString(),
        symbol: 'XAUUSD',
        direction: 'BUY',
        result: 1002,
        emotion: '🔥 Confident',
        notes: 'Initial institutional breakout.'
      }] as Trade[];
      setTrades(initial);
      localStorage.setItem('axon_trades', JSON.stringify(initial));
    }
  }, []);

  const addTrade = (trade: Trade) => {
    const newTrades = [...trades, trade];
    setTrades(newTrades);
    localStorage.setItem('axon_trades', JSON.stringify(newTrades));
  };

  const updateTrade = (id: string, updatedTrade: Trade) => {
    const newTrades = trades.map(t => t.id === id ? updatedTrade : t);
    setTrades(newTrades);
    localStorage.setItem('axon_trades', JSON.stringify(newTrades));
  };

  const deleteTrade = (id: string) => {
    const newTrades = trades.filter(t => t.id !== id);
    setTrades(newTrades);
    localStorage.setItem('axon_trades', JSON.stringify(newTrades));
  };

  const totalPL = trades.reduce((a, b) => a + b.result, 0);

  return (
    <div className="h-screen flex flex-col bg-slate-950 bg-mesh overflow-hidden select-none relative">
      <div className="scanline"></div>
      
      {/* Global Interface Header - Responsive Audit */}
      <nav className="h-16 md:h-24 shrink-0 border-b border-white/[0.04] bg-slate-950/50 backdrop-blur-3xl flex items-center px-4 md:px-10 z-50">
        <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 md:gap-6 cursor-pointer group" 
            onClick={() => setActiveTab(Tab.LEDGER)}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-sky-500 blur-2xl opacity-5 group-hover:opacity-20 transition-opacity"></div>
              <div className="w-8 h-8 md:w-12 md:h-12 bg-slate-900 border border-white/10 rounded-lg md:rounded-xl flex items-center justify-center shadow-2xl group-hover:border-sky-500/50 transition-all duration-700">
                <svg className="w-5 h-5 md:w-8 md:h-8 text-sky-500 group-hover:text-white transition-colors duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M12 2L2 22h4l6-13 6 13h4L12 2z" />
                   <path d="M9 15h6" strokeWidth="3" className="opacity-80" />
                </svg>
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg md:text-2xl font-[900] tracking-tight text-white leading-none flex items-center gap-1 md:gap-2 uppercase italic">
                AXON<span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-sky-600">TERMINAL</span>
              </h1>
              <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-1.5 opacity-40">
                <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.4em]">OS v2.4</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center bg-white/[0.02] p-1 md:p-1.5 rounded-xl md:rounded-[1.5rem] border border-white/[0.03] backdrop-blur-md overflow-x-auto no-scrollbar max-w-[50vw] sm:max-w-none">
            {Object.values(Tab).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-3 md:px-7 py-1.5 md:py-2.5 rounded-lg md:rounded-[1.2rem] text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-white bg-white/[0.06] shadow-xl border border-white/[0.05]' 
                    : 'text-slate-600 hover:text-slate-300'
                }`}
              >
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 md:w-1 h-0.5 md:h-1 bg-sky-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,1)]"></div>
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <div className="h-10 w-[1px] bg-white/[0.05]"></div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] leading-none mb-2">Portfolio Delta</span>
              <span className={`text-2xl font-mono font-black tracking-tight leading-none ${totalPL >= 0 ? 'text-emerald-400 neon-glow-sky' : 'text-rose-500'}`}>
                {formatCurrency(totalPL)}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Primary Content Controller */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full max-w-[1600px] mx-auto px-4 md:px-10 py-4 md:py-8 flex flex-col">
          <div className="flex-1 min-h-0">
            <div className="h-full animate-in fade-in zoom-in-[0.99] duration-700 ease-out">
              {activeTab === Tab.LEDGER && (
                <Journal 
                  trades={trades} 
                  onAddTrade={addTrade} 
                  onUpdateTrade={updateTrade} 
                  onDeleteTrade={deleteTrade} 
                />
              )}
              {activeTab === Tab.CALC && <Calculator />}
              {activeTab === Tab.PULSE && <Analytics trades={trades} />}
              {activeTab === Tab.INTEL && <div className="h-full overflow-y-auto custom-scroll pr-2 md:pr-4"><Library /></div>}
              {activeTab === Tab.NODE && <div className="h-full overflow-y-auto custom-scroll pr-2 md:pr-4"><About /></div>}
            </div>
          </div>
        </div>
      </main>

      <footer className="h-10 md:h-12 border-t border-white/[0.03] flex items-center px-4 md:px-10 justify-between bg-slate-950/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4 md:gap-10">
          <span className="text-[7px] md:text-[9px] font-black text-slate-700 tracking-[0.2em] md:tracking-[0.4em] uppercase">Status: Online</span>
          <div className="hidden sm:block h-4 w-[1px] bg-white/[0.05]"></div>
          <span className="hidden sm:block text-[7px] md:text-[9px] font-black text-slate-700 tracking-[0.4em] uppercase">Build: 2024.Q4</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
           <span className="hidden md:block text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Encrypted Session</span>
           <div className="text-[7px] md:text-[9px] font-black text-slate-800 uppercase tracking-widest bg-white/[0.01] px-2 md:px-3 py-1 rounded-full border border-white/[0.02]">AXON_V4</div>
        </div>
      </footer>
    </div>
  );
};

export default App;