
export const formatCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  // Apply 'M' for millions
  if (absValue >= 1000000) {
    return `${sign}$${(absValue / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  // Apply 'k' for thousands (1000 = 1k)
  if (absValue >= 1000) {
    return `${sign}$${(absValue / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  
  // Plain number for values under 1000
  const formatted = Math.floor(absValue).toString();
  return `${sign}$${formatted}`;
};

export const formatCurrencyK = (value: number): string => {
  // Alias to formatCurrency to maintain consistency across the app
  return formatCurrency(value);
};

export const formatFullCurrency = (value: number): string => {
  // Maintaining a full format if ever needed, but standardizing on the 'k' logic for now
  return formatCurrency(value);
};
