
import { Instrument, InstrumentType, RiskRule } from './types';

export const INSTRUMENTS: Instrument[] = [
  { symbol: 'EURUSD', type: InstrumentType.FOREX, pipValue: 10 },
  { symbol: 'GBPUSD', type: InstrumentType.FOREX, pipValue: 10 },
  { symbol: 'USDJPY', type: InstrumentType.FOREX, pipValue: 6.8 },
  { symbol: 'AUDUSD', type: InstrumentType.FOREX, pipValue: 10 },
  { symbol: 'XAUUSD', type: InstrumentType.COMMODITY, pipValue: 100 },
  { symbol: 'XAGUSD', type: InstrumentType.COMMODITY, pipValue: 50 },
  { symbol: 'USOIL', type: InstrumentType.COMMODITY, pipValue: 10 },
];

export const RISK_RULES: RiskRule[] = [
  {
    id: '1',
    category: 'Capital',
    title: 'The 1% Rule',
    content: 'Never risk more than 1% of your total account equity on a single trade. This ensures survival during losing streaks.',
    icon: '🛡️'
  },
  {
    id: '2',
    category: 'Strategy',
    title: 'Stop Loss Always',
    content: 'Trading without a stop loss is gambling. Set it the moment you enter a trade.',
    icon: '🛑'
  },
  {
    id: '3',
    category: 'Psychology',
    title: 'No Revenge Trading',
    content: 'Lost a trade? Step away. The market doesn\'t owe you anything. Revenge trading leads to account blown.',
    icon: '💆'
  },
  {
    id: '4',
    category: 'Strategy',
    title: 'Trade with Trend',
    content: 'The trend is your friend. Counter-trend trading requires high precision and experience.',
    icon: '📈'
  }
];
