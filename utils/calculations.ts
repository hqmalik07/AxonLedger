
import { INSTRUMENTS } from '../constants';
import { isSameDay } from 'date-fns';

export const calculateLotSize = (
  balance: number,
  riskPercent: number,
  stopLossPips: number,
  symbol: string
): { lotSize: number; dollarRisk: number } => {
  const instrument = INSTRUMENTS.find(i => i.symbol === symbol);
  if (!instrument || stopLossPips <= 0) return { lotSize: 0, dollarRisk: 0 };

  const dollarRisk = (balance * riskPercent) / 100;
  const lotSize = dollarRisk / (stopLossPips * instrument.pipValue);

  return { 
    lotSize: parseFloat(lotSize.toFixed(2)), 
    dollarRisk: parseFloat(dollarRisk.toFixed(2)) 
  };
};

export const getDailyPL = (trades: any[], date: Date) => {
  return trades
    .filter(t => isSameDay(new Date(t.date), date))
    .reduce((acc, curr) => acc + curr.result, 0);
};
