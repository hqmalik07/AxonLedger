import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Trade } from '../types';

interface AICoachProps {
  trades: Trade[];
}

const AICoach: React.FC<AICoachProps> = ({ trades }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzePerformance = async () => {
    if (trades.length === 0) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze my recent trading data and provide short, punchy psychological feedback.
      Recent Trades: ${JSON.stringify(trades.slice(-10).map(t => ({ 
        symbol: t.symbol, 
        result: t.result, 
        emotion: t.emotion 
      })))}
      
      Format your response with:
      - Mindset summary
      - Action Item.
      Keep it high-energy, direct, and under 25 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: 'You are Flux, an elite trading coach. Extremely short, direct feedback only.',
        }
      });
      setAnalysis(response.text || "Analysis unavailable.");
    } catch (error) {
      console.error(error);
      setAnalysis("Flux offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center text-sm">🤖</div>
        <div className="hidden sm:block">
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Flux AI</h4>
          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">Advisor</p>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {analysis ? (
          <div className="flex items-center justify-between gap-4 animate-in fade-in slide-in-from-right-4">
             <p className="text-[10px] text-slate-400 font-medium truncate italic leading-none">{analysis}</p>
             <button onClick={() => setAnalysis(null)} className="text-[8px] font-black text-violet-500 uppercase shrink-0">Reset</button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-4">
            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest hidden md:block">Log 3+ trades for neural assessment</span>
            <button 
              onClick={analyzePerformance}
              disabled={loading || trades.length < 3}
              className={`px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-violet-600 text-white hover:bg-violet-500'} ${trades.length < 3 ? 'opacity-20' : ''}`}
            >
              {loading ? 'Thinking...' : 'Analyze'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;