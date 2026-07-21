import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UnitContext = createContext(null);

export function UnitProvider({ children }) {
  const [unit, setUnit] = useLocalStorage('weather-app:unit', 'metric');

  const value = useMemo(
    () => ({
      unit,
      isMetric: unit === 'metric',
      toggleUnit: () => setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric')),
    }),
    [unit, setUnit]
  );

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
}

export function useUnit() {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error('useUnit must be used within a UnitProvider');
  return ctx;
}
