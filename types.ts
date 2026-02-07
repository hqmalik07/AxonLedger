
export enum InstrumentType {
  FOREX = 'Forex',
  COMMODITY = 'Commodity'
}

export enum Emotion {
  CALM = '🧘 Calm',
  CONFIDENT = '🔥 Confident',
  FEARFUL = '😨 Fearful',
  OVERCONFIDENT = '😤 Overconfident',
  REVENGE = '🤡 Revenge'
}

export enum TradeDirection {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface Instrument {
  symbol: string;
  type: InstrumentType;
  pipValue: number; // For 1 standard lot
}

export interface Trade {
  id: string;
  date: string; // ISO string
  symbol: string;
  direction: TradeDirection;
  result: number; // Profit or loss in currency
  emotion: Emotion;
  notes?: string;
}

export interface RiskRule {
  id: string;
  title: string;
  category: 'Capital' | 'Strategy' | 'Psychology';
  content: string;
  icon: string;
}
