import { Sun, Moon, MapPin } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useTheme } from '../context/ThemeContext';
import { useGeolocation } from '../hooks/useGeolocation';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
        className="relative flex h-8 w-16 items-center rounded-full bg-card-bg px-1 transition-colors"
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-accent-green text-white shadow transition-transform ${
            isDark ? 'translate-x-8' : 'translate-x-0'
          }`}
        >
          {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </span>
      </button>
      <span className="text-xs font-medium text-text-muted">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
    </div>
  );
}

function CurrentLocationButton({ onSelectLocation }) {
  const { locate, loading } = useGeolocation();

  async function handleClick() {
    try {
      const { lat, lon } = await locate();
      onSelectLocation(`${lat},${lon}`, null);
    } catch {
      // surfaced via geolocation error state elsewhere if needed
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-green px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-green/30 transition hover:brightness-105 disabled:opacity-70"
    >
      <MapPin className="h-4 w-4" />
      {loading ? 'Locating…' : 'Current Location'}
    </button>
  );
}

export function TopBar({ onSelectLocation }) {
  return (
    <div className="mb-6 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
      <ThemeToggle />
      <SearchBar onSelectLocation={onSelectLocation} />
      <CurrentLocationButton onSelectLocation={onSelectLocation} />
    </div>
  );
}
