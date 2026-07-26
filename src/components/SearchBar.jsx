import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
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

  function handleSubmit() {
    const trimmed = query.trim();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
    } else if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else if (trimmed) {
      onSelectLocation(trimmed, null);
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
      return;
    }
    if (!isOpen || suggestions.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }

  function handleRecentClick(location) {
    onSelectLocation(`${location.name}`, location);
  }

  return (
    <div className="w-full max-w-xl" ref={containerRef}>
      <div className="relative">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            role="combobox"
            aria-expanded={isOpen && suggestions.length > 0}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
            aria-label="Search for a city"
            placeholder="Search for your preferred city"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-full bg-card-bg py-2.5 pl-11 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:ring-2 focus:ring-accent-green/40"
          />
          {isOpen && suggestions.length > 0 && (
            <ul
              id="search-suggestions"
              role="listbox"
              className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl bg-card-bg shadow-lg"
            >
              {suggestions.map((place, index) => (
                <li
                  key={place.id}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={() => handleSelect(place)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    index === activeIndex ? 'bg-accent-green/10' : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="font-medium text-text-primary">{place.name}</span>
                  <span className="text-text-muted">
                    {place.region ? `, ${place.region}` : ''}, {place.country}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {searchError && (
          <p className="mt-1 text-xs text-red-400" role="alert">
            {searchError}
          </p>
        )}
      </div>

      {recent.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {recent.map((location) => (
            <button
              key={`${location.name}-${location.country}`}
              type="button"
              onClick={() => handleRecentClick(location)}
              className="rounded-full bg-card-bg px-3 py-1 text-xs font-medium text-text-muted transition hover:text-text-primary"
            >
              {location.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
