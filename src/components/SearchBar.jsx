import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useGeolocation } from '../hooks/useGeolocation';
import { searchLocations } from '../services/weatherApi';
import { useRecentLocations } from '../context/LocationContext';

export function SearchBar({ onSelectLocation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchError, setSearchError] = useState(null);
  const containerRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);
  const { locate, loading: locating, error: geoError } = useGeolocation();
  const { recent, addRecent } = useRecentLocations();

  useEffect(() => {
    let cancelled = false;

    async function fetchSuggestions() {
      if (debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const results = await searchLocations(debouncedQuery.trim());
        if (!cancelled) {
          setSuggestions(results);
          setSearchError(null);
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
          setSearchError('Could not load suggestions.');
        }
      }
    }

    fetchSuggestions();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(place) {
    const location = { name: place.name, region: place.region, country: place.country };
    addRecent(location);
    onSelectLocation(`${place.lat},${place.lon}`, location);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event) {
    if (!isOpen || suggestions.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }

  async function handleUseMyLocation() {
    try {
      const { lat, lon } = await locate();
      onSelectLocation(`${lat},${lon}`, null);
    } catch {
      // error message surfaced via geoError below
    }
  }

  function handleRecentClick(location) {
    onSelectLocation(`${location.name}`, location);
  }

  return (
    <div className="w-full max-w-xl" ref={containerRef}>
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              role="combobox"
              aria-expanded={isOpen && suggestions.length > 0}
              aria-controls="search-suggestions"
              aria-autocomplete="list"
              aria-label="Search for a city"
              placeholder="Search for a city..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-sky-900"
            />
            {isOpen && suggestions.length > 0 && (
              <ul
                id="search-suggestions"
                role="listbox"
                className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                {suggestions.map((place, index) => (
                  <li
                    key={place.id}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseDown={() => handleSelect(place)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`cursor-pointer px-4 py-2 text-sm ${
                      index === activeIndex
                        ? 'bg-sky-100 dark:bg-sky-900/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-medium text-slate-900 dark:text-white">
                      {place.name}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {place.region ? `, ${place.region}` : ''}, {place.country}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locating}
            aria-label="Use my location"
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {locating ? 'Locating…' : '📍 My location'}
          </button>
        </div>
        {(geoError || searchError) && (
          <p className="mt-1 text-xs text-red-500" role="alert">
            {geoError || searchError}
          </p>
        )}
      </div>

      {recent.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {recent.map((location) => (
            <button
              key={`${location.name}-${location.country}`}
              type="button"
              onClick={() => handleRecentClick(location)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {location.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
