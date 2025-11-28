import { useCallback, useState } from 'react';
import client from '../api/client';

export interface NormalizedHourlyWeather {
  time: string;
  temperature: number | null;
  icon?: string;
  description?: string;
}

export interface NormalizedWeather {
  cityName?: string;
  temperature: number | null;
  description?: string;
  windSpeed: number | null;
  windDeg?: number | null;
  humidity: number | null;
  icon?: string;
  hourly: NormalizedHourlyWeather[];
}

function formatHourLabel(rawTime: unknown): string {
  if (!rawTime && rawTime !== 0) return '';

  // If backend returns UNIX timestamp in seconds or milliseconds
  if (typeof rawTime === 'number') {
    const ms = rawTime < 1e12 ? rawTime * 1000 : rawTime;
    const d = new Date(ms);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
    return '';
  }

  if (typeof rawTime === 'string') {
    // If it's already something like "04:00" just return as is
    if (/^\d{1,2}:\d{2}$/.test(rawTime)) {
      return rawTime;
    }

    const d = new Date(rawTime);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }

    return rawTime;
  }

  return '';
}

function mapViewToRu(view?: string): string | undefined {
  if (!view) return undefined;
  const v = view.toLowerCase();

  if (v === 'clear') return 'ясно';
  if (v === 'night') return 'ясно ночью';
  if (v === 'cloudy' || v === 'clouds' || v === 'overcast') return 'облачно';
  if (v === 'rain' || v === 'rainy' || v === 'drizzle') return 'дождь';
  if (v === 'snow' || v === 'snowy') return 'снег';
  if (v === 'storm' || v === 'thunderstorm') return 'гроза';

  return view;
}

export function useWeatherForecast() {
  const [data, setData] = useState<NormalizedWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await client.get('/api/v1/weather/forecast', {
        params: { lat, lon },
      });

      const raw = res.data || {};

      // Backend structure as provided:
      // {
      //   current_temp, description, view, wind_speed, wind_dir, humidity, hours: [{ time, view, temp }]
      // }
      const current: {
        temp: number | null;
        description: string | null;
        view: string | null;
        wind_speed: number | null;
        humidity: number | null;
        wind_dir: string | null;
      } = {
        temp: typeof raw.current_temp === 'number' ? raw.current_temp : null,
        description:
          typeof raw.description === 'string' ? raw.description : null,
        view: typeof raw.view === 'string' ? raw.view : null,
        wind_speed:
          typeof raw.wind_speed === 'number' ? raw.wind_speed : null,
        humidity: typeof raw.humidity === 'number' ? raw.humidity : null,
        wind_dir: typeof raw.wind_dir === 'string' ? raw.wind_dir : null,
      };

      const hourlyRaw = Array.isArray(raw.hours) ? raw.hours : [];

      const normalized: NormalizedWeather = {
        cityName:
          raw.city ||
          raw.locationName ||
          raw.regionName ||
          raw.name ||
          raw.location?.name,
        temperature: current.temp,
        description:
          mapViewToRu(current.view || undefined) ||
          (current.description || undefined),
        windSpeed: current.wind_speed,
        windDeg: undefined,
        humidity: current.humidity ?? null,
        icon:
          (current.view || undefined) ||
          (raw.icon as string | undefined) ||
          (raw.currentIcon as string | undefined),
        hourly: hourlyRaw.map((item: any) => {
          const rawTime = item.time ?? null;

          return {
            time: formatHourLabel(rawTime),
            temperature: typeof item.temp === 'number' ? item.temp : null,
            icon: item.view,
            description: mapViewToRu(item.view),
          };
        }),
      };

      setData(normalized);
      return normalized;
    } catch (e) {
      setError(e);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchWeather };
}

export default useWeatherForecast;


