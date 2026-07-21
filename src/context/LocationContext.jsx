import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LocationContext = createContext(null);

const MAX_RECENT = 5;

export function LocationProvider({ children }) {
  const [recent, setRecent] = useLocalStorage('weather-app:recent-locations', []);

  const value = useMemo(
    () => ({
      recent,
      addRecent: (location) => {
        setRecent((prev) => {
          const key = `${location.name}, ${location.country}`;
          const filtered = prev.filter((item) => `${item.name}, ${item.country}` !== key);
          return [location, ...filtered].slice(0, MAX_RECENT);
        });
      },
      clearRecent: () => setRecent([]),
    }),
    [recent, setRecent]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useRecentLocations() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useRecentLocations must be used within a LocationProvider');
  return ctx;
}
