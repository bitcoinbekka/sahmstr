import { useState, useCallback } from 'react';
import type { WeatherContext } from '@/lib/stylistPrompts';

/** WMO weather interpretation codes → plain language */
const WEATHER_CODES: Record<number, string> = {
  0: 'clear sky',
  1: 'mostly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'foggy',
  48: 'freezing fog',
  51: 'light drizzle',
  53: 'drizzle',
  55: 'heavy drizzle',
  56: 'freezing drizzle',
  57: 'heavy freezing drizzle',
  61: 'light rain',
  63: 'rain',
  65: 'heavy rain',
  66: 'freezing rain',
  67: 'heavy freezing rain',
  71: 'light snow',
  73: 'snow',
  75: 'heavy snow',
  77: 'snow grains',
  80: 'light rain showers',
  81: 'rain showers',
  82: 'heavy rain showers',
  85: 'light snow showers',
  86: 'heavy snow showers',
  95: 'thunderstorm',
  96: 'thunderstorm with hail',
  99: 'severe thunderstorm with hail',
};

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
  timezone?: string;
}

/**
 * Fetches current weather from Open-Meteo using browser geolocation.
 * Free, no API key required.
 */
export function useWeather() {
  const [weather, setWeather] = useState<WeatherContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setError('Location is not available in this browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 1000 * 60 * 15,
        });
      });

      const { latitude, longitude } = position.coords;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Weather service is unavailable right now.');
      }

      const data: OpenMeteoResponse = await response.json();
      const temp = data.current?.temperature_2m;
      const code = data.current?.weather_code;

      if (typeof temp !== 'number') {
        throw new Error('Weather data was incomplete.');
      }

      // Derive a friendly location name from the timezone (e.g. "America/Denver" → "Denver")
      const locationName = data.timezone?.split('/').pop()?.replace(/_/g, ' ');

      setWeather({
        temperatureF: temp,
        condition: WEATHER_CODES[code ?? -1] ?? 'unknown conditions',
        locationName,
      });
    } catch (err) {
      // Geolocation errors expose a numeric `code` (1 = permission denied)
      const code = (err as { code?: number } | null)?.code;
      if (code === 1) {
        setError('Location permission denied. You can still get outfits without weather.');
      } else if (code === 2 || code === 3) {
        setError('Could not determine your location. You can still get outfits without weather.');
      } else {
        setError(err instanceof Error ? err.message : 'Could not get weather.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearWeather = useCallback(() => {
    setWeather(null);
    setError(null);
  }, []);

  return { weather, fetchWeather, clearWeather, isLoading, error };
}
