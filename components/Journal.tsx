import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Trade, TradeDirection, Emotion } from '../types';
import { INSTRUMENTS } from '../constants';
import { getDailyPL } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

interface JournalProps {
  trades: Trade[];
  onAddTrade: (trade: Trade) => void;
  onUpdateTrade: (id: string, trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
}

const Journal: React.FC<JournalProps> = ({ trades, onAddTrade, onUpdateTrade, onDeleteTrade }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalView, setModalView] = useState<'LIST' | 'FORM'>('LIST');
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);
  
  const [isProfit, setIsProfit] = useState(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    symbol: 'XAUUSD', 
    direction: TradeDirection.BUY, 
    emotion: Emotion.CALM,
    notes: ''
  });

  const monthStart = startOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const tradesForSelectedDay = selectedDay 
    ? trades.filter(t => isSameDay(new Date(t.date), selectedDay))
    : [];

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setShowModal(true);
    
    const dayTrades = trades.filter(t => isSameDay(new Date(t.date), day));
    if (dayTrades.length > 0) {
      setModalView('LIST');
    } else {
      openForm();
    }
  };

  const openForm = (trade?: Trade) => {
    if (trade) {
      setEditingTradeId(trade.id);
      setIsProfit(trade.result >= 0);
      setInputValue(Math.abs(trade.result).toString());
      setNewTrade({
        symbol: trade.symbol,
        direction: trade.direction,
        emotion: trade.emotion,
        notes: trade.notes
      });
    } else {
      setEditingTradeId(null);
      setIsProfit(true);
      setInputValue('');
      setNewTrade({
        symbol: 'XAUUSD', 
        direction: TradeDirection.BUY, 
        emotion: Emotion.CALM,
        notes: ''
      });
    }
    setModalView('FORM');
  };

  const handleSave = () => {
    if (selectedDay) {
      const amount = parseFloat(inputValue) || 0;
      const finalResult = isProfit ? amount : -amount;
      
      const tradeData: Trade = {
        ...newTrade as Trade,
        result: finalResult,
        id: editingTradeId || Math.random().toString(36).substr(2, 9),
        date: selectedDay.toISOString()
      };

      if (editingTradeId) {
        onUpdateTrade(editingTradeId, tradeData);
      } else {
        onAddTrade(tradeData);
      }
      
      setShowModal(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete this tactical record?')) {
      onDeleteTrade(id);
      setShowModal(false);
    }
  };

  const totalMonthPL = trades
    .filter(t => isSameMonth(new Date(t.date), monthStart))
    .reduce((a, b) => a + b.result, 0);

  return (
    <div className="h-full flex flex-col space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header System */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-10">
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-3xl md:text-5xl font-[900] text-white tracking-tight uppercase leading-tight italic">Execution Log</h2>
            <div className="flex items-center gap-3">
               <span className="w-6 md:w-8 h-[2px] bg-sky-500 rounded-full"></span>
               <p className="text-[8px] md:text-[10px] font-black text-sky-500/60 uppercase tracking-[0.3em] md:tracking-[0.4em]">PRECISION IN ENTRY. CLARITY IN REFLECTION.</p>
            </div>
          </div>
          <div className="flex items-center bg-white/[0.03] rounded-2xl md:rounded-[1.5rem] p-1.5 md:p-2 border border-white/[0.04] backdrop-blur-md w-fit">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 md:p-3 text-slate-500 hover:text-white transition-all hover:bg-white/5 rounded-xl">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="px-4 md:px-8 text-[11px] md:text-sm font-black text-white uppercase tracking-[0.1em] md:tracking-[0.2em]">{format(currentDate, 'MMMM yyyy')}</span>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 md:p-3 text-slate-500 hover:text-white transition-all hover:bg-white/5 rounded-xl">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none mb-2">Cycle Performance</span>
          <span className={`text-2xl md:text-3xl font-mono font-black tracking-tight leading-none ${totalMonthPL >= 0 ? 'text-emerald-400 neon-glow-sky' : 'text-rose-500 neon-glow-rose'}`}>
            {formatCurrency(totalMonthPL)}
          </span>
        </div>
      </div>

      {/* Grid Interface */}
      <div className="flex-1 min-h-0 glass rounded-3xl md:rounded-[3rem] p-3 md:p-4 flex flex-col overflow-hidden relative group border border-white/[0.05] bg-slate-950/20 backdrop-blur-3xl shadow-2xl">
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4 px-1 md:px-2">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="text-center text-[8px] md:text-[10px] font-[900] text-slate-700 tracking-[0.3em] md:tracking-[0.5em] py-2 md:py-3 uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 gap-1 md:gap-2">
          {days.map((day, idx) => {
            const pl = getDailyPL(trades, day);
            const current = isSameMonth(day, monthStart);
            const today = isToday(day);
            const hasTrades = trades.some(t => isSameDay(new Date(t.date), day));
            
            return (
              <button 
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                style={{ animationDelay: `${idx * 8}ms` }}
                className={`
                  relative p-2 md:p-4 rounded-xl md:rounded-[1.8rem] border transition-all duration-300 flex flex-col items-center justify-center text-center group/cell
                  animate-in fade-in zoom-in-95 fill-mode-both
                  ${!current ? 'opacity-0 pointer-events-none' : 'bg-white/[0.02] border-white/[0.03]'}
                  ${today ? 'bg-sky-500/10 border-sky-500/40 ring-1 ring-sky-500/10' : 'hover:bg-white/[0.06] hover:border-sky-500/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] hover:-translate-y-1'}
                  ${pl > 0 ? 'bg-emerald-500/[0.02] border-emerald-500/10' : pl < 0 ? 'bg-rose-500/[0.02] border-rose-500/10' : ''}
                `}
              >
                <span className={`text-[9px] md:text-[10px] font-black mb-1 md:mb-1.5 transition-colors ${today ? 'text-sky-400' : hasTrades ? 'text-slate-200' : 'text-slate-600'}`}>
                  {format(day, 'd')}
                </span>
                
                {pl !== 0 ? (
                  <div className="flex flex-col items-center">
                    <span className={`text-[12px] md:text-[16px] font-mono font-black tracking-tight leading-none transition-transform duration-300 group-hover/cell:scale-110 ${pl > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {pl > 0 ? '+' : ''}{formatCurrency(pl)}
                    </span>
                    <div className={`mt-1.5 md:mt-2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${pl > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`}></div>
                  </div>
                ) : (
                  current && <div className="h-3 md:h-[20px] w-[2px] bg-white/[0.02] rounded-full"></div>
                )}

                {today && (
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,1)]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tactical Form Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="glass border-white/10 w-full max-w-xl rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 relative flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-6 right-6 md:top-10 md:right-10 text-slate-500 hover:text-white transition-all hover:rotate-90 p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl z-10"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            
            <div className="mb-6 md:mb-10 text-center sm:text-left shrink-0">
              <h3 className="text-2xl md:text-4xl font-[900] text-white tracking-tight uppercase leading-tight">
                {modalView === 'LIST' ? 'Operational Intel' : editingTradeId ? 'Modify Strategy' : 'Tactical Entry'}
              </h3>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 md:mt-5">
                <span className="text-[9px] md:text-[11px] font-black text-sky-400 uppercase tracking-[0.2em] md:tracking-[0.4em] bg-sky-500/10 px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-sky-500/20">Operational</span>
                <span className="text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em]">
                  {format(selectedDay!, 'EEEE, MMMM dd')}
                </span>
              </div>
            </div>
            
            {modalView === 'LIST' ? (
              <div className="flex flex-col space-y-4 md:space-y-5 pb-4">
                <div className="space-y-3 md:space-y-4">
                  {tradesForSelectedDay.slice(0, 4).map((trade, idx) => (
                    <button 
                      key={trade.id} 
                      onClick={() => openForm(trade)}
                      className="w-full bg-white/[0.02] border border-white/[0.04] rounded-2xl md:rounded-[2.5rem] p-4 md:p-6 flex items-center justify-between group/item hover:bg-white/[0.05] hover:border-sky-500/40 transition-all text-left animate-in slide-in-from-right-8 duration-500"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className={`w-1 md:w-1.5 h-10 md:h-12 rounded-full ${trade.result >= 0 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`}></div>
                        <div>
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-lg md:text-xl font-[900] text-white tracking-tight">{trade.symbol}</span>
                            <span className={`text-[8px] md:text-[9px] font-black px-1.5 md:px-2 py-0.5 rounded-md md:rounded-lg ${trade.direction === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{trade.direction}</span>
                          </div>
                          <div className={`text-lg md:text-xl font-mono font-black mt-1 ${trade.result >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrency(trade.result)}
                          </div>
                        </div>
                      </div>
                      <div className="text-slate-700 group-hover/item:text-sky-400 transition-all group-hover/item:translate-x-2">
                         <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => openForm()} 
                  className="w-full py-5 md:py-6 border-2 border-dashed border-white/5 rounded-2xl md:rounded-[2.5rem] text-[10px] md:text-[12px] font-black text-slate-600 uppercase tracking-[0.3em] md:tracking-[0.4em] hover:border-sky-500/50 hover:text-sky-400 transition-all flex items-center justify-center gap-4 group/add"
                >
                  <span className="text-xl md:text-2xl group-hover/add:scale-125 transition-transform">+</span> NEW POSITION
                </button>

                {tradesForSelectedDay.length > 4 && (
                  <p className="text-[8px] md:text-[9px] font-black text-slate-700 text-center uppercase tracking-widest mt-1 md:mt-2">Showing 4 of {tradesForSelectedDay.length} records</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-6 md:space-y-8 pb-4 md:pb-6 overflow-hidden">
                <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0">
                  <button onClick={() => setIsProfit(true)} className={`py-3 md:py-4 rounded-2xl md:rounded-3xl border transition-all flex items-center justify-center gap-3 md:gap-4 ${isProfit ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-slate-900 border-white/5 text-slate-600 opacity-40 hover:opacity-100'}`}>
                    <span className="text-lg md:text-xl">📈</span> <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">PROFIT</span>
                  </button>
                  <button onClick={() => setIsProfit(false)} className={`py-3 md:py-4 rounded-2xl md:rounded-3xl border transition-all flex items-center justify-center gap-3 md:gap-4 ${!isProfit ? 'bg-rose-500/10 border-rose-500/60 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.1)]' : 'bg-slate-900 border-white/5 text-slate-600 opacity-40 hover:opacity-100'}`}>
                    <span className="text-lg md:text-xl">📉</span> <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">LOSS</span>
                  </button>
                </div>

                <div className="relative group shrink-0">
                   <span className={`absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-2xl md:text-3xl font-black ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>$</span>
                   <input 
                    type="number" 
                    autoFocus 
                    placeholder="0.00" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    className={`w-full bg-slate-900/50 border-2 rounded-2xl md:rounded-[3rem] pl-14 md:pl-16 pr-8 md:pr-10 py-6 md:py-8 text-4xl md:text-5xl font-mono font-black focus:ring-0 outline-none transition-all ${isProfit ? 'border-emerald-500/20 focus:border-emerald-500 text-emerald-400' : 'border-rose-500/20 focus:border-rose-500 text-rose-400'}`} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6 shrink-0">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-2 md:ml-3">Asset</label>
                    <select value={newTrade.symbol} onChange={(e)=>setNewTrade({...newTrade, symbol: e.target.value})} className="w-full bg-slate-900/60 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-xs md:text-sm font-black outline-none cursor-pointer hover:bg-slate-900 transition-colors">
                      {INSTRUMENTS.map(i => <option key={i.symbol} value={i.symbol}>{i.symbol}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-2 md:ml-3">Direction</label>
                    <div className="flex gap-2 h-10 md:h-12">
                      {[TradeDirection.BUY, TradeDirection.SELL].map(d => (
                        <button key={d} onClick={()=>setNewTrade({...newTrade, direction: d})} className={`flex-1 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black tracking-[0.1em] transition-all border ${newTrade.direction === d ? 'bg-sky-600 border-sky-400 text-white shadow-xl' : 'bg-slate-900/60 border-white/10 text-slate-500 hover:text-slate-200'}`}>{d}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3 shrink-0">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em] ml-2 md:ml-3">Cognitive Load</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(Emotion).map(e => (
                      <button 
                        key={e} 
                        onClick={()=>setNewTrade({...newTrade, emotion: e as Emotion})} 
                        className={`px-3 md:px-4 py-2 md:py-3 rounded-xl text-[8px] md:text-[9px] font-black uppercase transition-all border ${newTrade.emotion === e ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-900/60 border-white/10 text-slate-500 hover:text-slate-200'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea 
                  placeholder="Notes..." 
                  value={newTrade.notes} 
                  onChange={(e) => setNewTrade({...newTrade, notes: e.target.value})} 
                  className="w-full bg-slate-900/60 border border-white/10 rounded-2xl md:rounded-[2rem] p-4 md:p-6 text-xs md:text-sm font-medium text-slate-300 outline-none h-20 md:h-24 resize-none focus:border-sky-500/60 transition-colors shrink-0" 
                />
                
                <div className="flex flex-col gap-3 md:gap-4 pt-2 md:pt-4 shrink-0">
                  <div className="flex gap-3 md:gap-4">
                    {tradesForSelectedDay.length > 0 && (
                      <button onClick={() => setModalView('LIST')} className="flex-1 bg-slate-900 text-slate-600 font-black py-4 md:py-5 rounded-2xl md:rounded-[2.5rem] text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:text-white transition-all border border-white/5">BACK</button>
                    )}
                    <button onClick={handleSave} className="flex-[3] bg-white text-slate-950 font-black py-4 md:py-5 rounded-2xl md:rounded-[2.5rem] text-[10px] md:text-xs shadow-2xl hover:bg-sky-600 hover:text-white transition-all transform active:scale-95 uppercase tracking-[0.3em]">
                      {editingTradeId ? 'UPDATE' : 'COMMIT'}
                    </button>
                  </div>
                  
                  {editingTradeId && (
                    <button 
                      onClick={() => handleDelete(editingTradeId)} 
                      className="w-full text-rose-500/40 hover:text-rose-500 py-1 md:py-2 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all"
                    >
                      ERASE RECORD
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;