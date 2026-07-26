import { useEffect, useRef, useState } from 'react';

function useLiveClock(location) {
  const offsetRef = useRef(0);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!location?.localtime_epoch) return undefined;
    offsetRef.current = location.localtime_epoch * 1000 - Date.now();
    setNow(new Date(Date.now() + offsetRef.current));

    const interval = setInterval(() => {
      setNow(new Date(Date.now() + offsetRef.current));
    }, 1000);
    return () => clearInterval(interval);
  }, [location?.localtime_epoch]);

  return now;
}

export function LocationTimeCard({ location }) {
  const now = useLiveClock(location);

  const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl bg-card-bg p-6">
      <p className="text-sm font-semibold text-text-muted">{location?.name ?? '—'}</p>
      <p className="my-2 text-[52px] font-bold leading-none tracking-tight text-text-primary sm:text-[56px]">
        {time}
      </p>
      <p className="text-sm text-text-muted">{date}</p>
    </div>
  );
}
