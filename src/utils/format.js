export function formatTemp(celsius, fahrenheit, isMetric) {
  const value = isMetric ? celsius : fahrenheit;
  return `${Math.round(value)}°${isMetric ? 'C' : 'F'}`;
}

export function formatSpeed(kph, mph, isMetric) {
  return isMetric ? `${Math.round(kph)} km/h` : `${Math.round(mph)} mph`;
}

export function formatPressure(mb, inches, isMetric) {
  return isMetric ? `${Math.round(mb)} mb` : `${inches.toFixed(2)} in`;
}

export function formatVisibility(km, miles, isMetric) {
  return isMetric ? `${km} km` : `${miles} mi`;
}

export function formatDay(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

export function formatFullDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatHour(timeString) {
  const date = new Date(timeString);
  return date.toLocaleTimeString(undefined, { hour: 'numeric' });
}

export function aqiLabel(index) {
  const labels = [
    'Good',
    'Moderate',
    'Unhealthy for sensitive groups',
    'Unhealthy',
    'Very unhealthy',
    'Hazardous',
  ];
  return labels[(index || 1) - 1] || 'Unknown';
}
