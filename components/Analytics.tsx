import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { isSameWeek, format } from 'date-fns';
import { Trade } from '../types';
import AICoach from './AICoach';
import { formatCurrencyK } from '../utils/formatters';

interface AnalyticsProps {
  trades: Trade[];
}

const Analytics: React.FC<AnalyticsProps> = ({ trades }) => {
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.result > 0).length;
  const losingTrades = totalTrades - winningTrades;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const netPL = trades.reduce((acc, t) => acc + t.result, 0);

  const now = new Date();
  const weeklyTrades = trades.filter(t => isSameWeek(new Date(t.date), now));
  const weeklyPL = weeklyTrades.reduce((acc, t) => acc + t.result, 0);
  const weeklyWinningTrades = weeklyTrades.filter(t => t.result > 0).length;
  const weeklyWinRate = weeklyTrades.length > 0 ? (weeklyWinningTrades / weeklyTrades.length) * 100 : 0;

  let balance = 10000;
  const equityData = trades.length > 0 
    ? trades.map((t, i) => ({ name: i, equity: (balance += t.result) })) 
    : [{name: 0, equity: 10000}];

  const winLossData = [
    { name: 'Wins', value: winningTrades, color: '#10b981' },
    { name: 'Losses', value: losingTrades, color: '#f43f5e' }
  ];

  // Sort trades by date descending for history log
  const sortedTrades = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="h-full flex flex-col space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 overflow-hidden">
      {/* Tab Header System */}
      <div className="flex items-end justify-between shrink-0">
        <div className="space-y-2 md:space-y-3">
          <h2 className="text-3xl md:text-5xl font-[900] text-white tracking-tight uppercase leading-tight italic">Market Pulse</h2>
          <div className="flex items-center gap-3">
             <span className="w-6 md:w-8 h-[2px] bg-sky-500 rounded-full"></span>
             <p className="text-[8px] md:text-[10px] font-black text-sky-500/60 uppercase tracking-[0.3em] md:tracking-[0.4em]">NUMBERS NEVER LIE. NARRATIVES DO.</p>
          </div>
        </div>
      </div>

      {/* Top Stats Row - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 shrink-0">
        {[
          { l: 'NET P&L', v: formatCurrencyK(netPL), c: netPL >= 0 ? 'text-emerald-400' : 'text-rose-500' },
          { l: 'WIN RATE', v: `${winRate.toFixed(1)}%`, c: 'text-sky-400' },
          { l: 'TRADES', v: totalTrades, c: 'text-white' },
          { l: 'VELOCITY', v: `${(winRate * 1.1).toFixed(0)}%`, c: 'text-indigo-400' },
        ].map((s, i) => (
          <div key={i} className="glass p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/[0.05] flex flex-col justify-center transform transition-all hover:scale-[1.02] hover:bg-white/[0.04]">
            <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">{s.l}</span>
            <span className={`text-xl md:text-2xl font-black tracking-tight ${s.c}`}>{s.v}</span>
          </div>
        ))}
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 min-h-0 flex flex-col gap-4 md:gap-6 overflow-y-auto no-scrollbar pr-1 md:pr-2 pb-6">
        {/* Weekly Snapshot - Responsive Layout */}
        <div className="shrink-0 bg-sky-500/5 border border-sky-500/10 p-6 md:p-8 rounded-2xl md:rounded-3xl flex flex-col sm:flex-row items-center justify-between backdrop-blur-md gap-6">
          <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-sky-600/20 rounded-xl flex items-center justify-center text-2xl md:text-3xl shadow-xl shadow-sky-500/10">📊</div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tight leading-tight">Weekly Delta</h3>
              <p className="text-sky-500/60 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mt-2 md:mt-3">Operational Phase Active</p>
            </div>
          </div>
          
          <div className="flex gap-8 md:gap-12 w-full sm:w-auto justify-around sm:justify-end">
            <div className="text-center">
               <div className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1 md:mb-2">Weekly P&L</div>
               <div className={`text-xl md:text-2xl font-mono font-black ${weeklyPL >= 0 ? 'text-emerald-400 neon-glow-sky' : 'text-rose-500'}`}>
                 {weeklyPL >= 0 ? '+' : ''}{formatCurrencyK(weeklyPL)}
               </div>
            </div>
            <div className="text-center">
               <div className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1 md:mb-2">Success Rate</div>
               <div className="text-xl md:text-2xl font-mono font-black text-sky-400">
                 {weeklyWinRate.toFixed(0)}%
               </div>
            </div>
          </div>
        </div>

        {/* Charts Grid - Responsive Stacking */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 shrink-0 h-auto md:h-80">
          {/* Equity Curve */}
          <div className="md:col-span-8 glass p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/[0.05] flex flex-col overflow-hidden h-64 md:h-full">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">Equity Trajectory</h3>
              <span className="text-[8px] md:text-[10px] font-black text-sky-400 bg-sky-400/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-[0.3em] md:tracking-[0.4em] border border-sky-400/20">Live Sync</span>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={equityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '10px', fontWeight: '900', color: '#fff' }}
                    itemStyle={{ color: '#0ea5e9' }}
                    cursor={{ stroke: 'rgba(14, 165, 233, 0.2)', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="equity" 
                    stroke="#0ea5e9" 
                    strokeWidth={3} 
                    dot={false} 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Win vs Loss */}
          <div className="md:col-span-4 glass p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/[0.05] flex flex-col h-64 md:h-full">
            <h3 className="text-[9px] md:text-[10px] font-black text-slate-500 mb-4 md:mb-6 uppercase tracking-[0.3em] md:tracking-[0.4em]">Performance Split</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={winLossData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={9} fontWeight="900" stroke="#475569" />
                  <YAxis axisLine={false} tickLine={false} fontSize={9} stroke="#475569" hide />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '10px' }} />
                  <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={32} animationDuration={1500}>
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.4} stroke={entry.color} strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trade History Log - Responsive Padding */}
        <div className="glass p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/[0.05] flex flex-col shrink-0 min-h-[300px] md:min-h-[400px]">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h3 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">Tactical History Log</h3>
            <span className="text-[9px] md:text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] md:tracking-[0.4em]">Global Node Ledger</span>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 md:space-y-3">
            {sortedTrades.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <span className="text-4xl md:text-6xl mb-4">📁</span>
                <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em]">No Records</span>
              </div>
            ) : (
              sortedTrades.map((trade) => (
                <div key={trade.id} className="bg-white/[0.02] border border-white/[0.04] rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 flex items-center justify-between hover:bg-white/[0.04] transition-all group cursor-default">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-center w-8 md:w-10">
                       <div className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase leading-none">{format(new Date(trade.date), 'MMM')}</div>
                       <div className="text-base md:text-lg font-black text-slate-300 leading-none mt-1 md:mt-1.5">{format(new Date(trade.date), 'dd')}</div>
                    </div>
                    <div className="w-[1px] h-8 md:h-10 bg-white/[0.05]"></div>
                    <div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-sm md:text-base font-black text-white">{trade.symbol}</span>
                        <span className={`text-[8px] md:text-[10px] font-black px-2 py-0.5 md:py-1 rounded-md md:rounded-lg leading-none ${trade.direction === 'BUY' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                          {trade.direction}
                        </span>
                      </div>
                      <div className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] md:tracking-[0.2em] mt-1 md:mt-1.5">{trade.emotion.split(' ')[1]}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`text-lg md:text-xl font-mono font-black tracking-tight ${trade.result >= 0 ? 'text-emerald-400 neon-glow-sky' : 'text-rose-500'}`}>
                      {trade.result >= 0 ? '+' : ''}{formatCurrencyK(trade.result)}
                    </span>
                    <span className="text-[8px] md:text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] md:tracking-[0.4em] mt-0.5 md:mt-1">Settled</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Coach */}
        <div className="shrink-0 transform transition-all hover:translate-y-[-2px] md:hover:translate-y-[-4px]">
          <AICoach trades={trades} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;