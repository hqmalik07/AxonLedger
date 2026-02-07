import React, { useState, useEffect } from 'react';
import { INSTRUMENTS } from '../constants';
import { calculateLotSize } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const Calculator: React.FC = () => {
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [slPips, setSlPips] = useState<number>(20);
  const [symbol, setSymbol] = useState<string>('EURUSD');
  const [result, setResult] = useState({ lotSize: 0, dollarRisk: 0 });

  useEffect(() => {
    setResult(calculateLotSize(balance, riskPercent, slPips, symbol));
  }, [balance, riskPercent, slPips, symbol]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 h-full">
      <div className="lg:col-span-7 space-y-6">
        <header>
          <h2 className="text-4xl font-[900] text-white tracking-tighter mb-2 uppercase italic">Position Terminal</h2>
          <div className="flex items-center gap-3">
             <span className="w-8 h-[2px] bg-sky-500 rounded-full"></span>
             <p className="text-[10px] font-black text-sky-500/60 uppercase tracking-[0.4em]">QUANTIATIVE SIZING ENGINE.</p>
          </div>
        </header>

        <div className="glass p-8 rounded-[3rem] space-y-8 relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 p-12 bg-sky-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="space-y-6 relative">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Equity Balance</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                  type="number" 
                  value={balance} 
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-[2rem] pl-12 pr-6 py-5 text-2xl font-black focus:border-sky-500/50 focus:bg-slate-900 focus:ring-0 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">SL Pips</label>
                <input 
                  type="number" 
                  value={slPips} 
                  onChange={(e) => setSlPips(Number(e.target.value))}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-xl font-bold focus:border-sky-500/50 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Asset</label>
                <select 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-xl font-bold focus:border-sky-500/50 outline-none appearance-none cursor-pointer"
                >
                  {INSTRUMENTS.map(i => <option key={i.symbol} value={i.symbol}>{i.symbol}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Risk Exposure</label>
                <span className="text-sky-400 font-black text-xl">{riskPercent}%</span>
              </div>
              <div className="flex gap-2 mb-6">
                {[0.5, 1, 2, 5].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setRiskPercent(p)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${riskPercent === p ? 'bg-sky-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-slate-300'}`}
                  >
                    {p === 5 ? 'MAX' : p + '%'}
                  </button>
                ))}
              </div>
              <input 
                type="range" min="0.1" max="10" step="0.1" value={riskPercent} 
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-10 rounded-[3rem] shadow-2xl flex flex-col justify-center items-center text-center group">
           <div className="text-[10px] font-black text-sky-500/50 uppercase tracking-[0.3em] mb-4">OPTIMAL SIZE</div>
           <div className="text-8xl font-black text-white tracking-tighter mb-4 group-hover:scale-105 transition-transform duration-500">
             {result.lotSize}
           </div>
           <div className="text-2xl font-black text-slate-500 tracking-tight">Standard Lots</div>
           <div className="w-16 h-1 bg-white/10 rounded-full my-8"></div>
           <div className="flex items-center gap-3">
             <span className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">Fixed Risk</span>
             <span className="text-2xl font-black text-white">{formatCurrency(result.dollarRisk)}</span>
           </div>
        </div>

        <div className="glass p-8 rounded-[3rem] flex items-center justify-between group">
           <div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Target Reward (2R)</div>
              <div className="text-2xl font-black text-emerald-400">+{formatCurrency(result.dollarRisk * 2)}</div>
           </div>
           <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;