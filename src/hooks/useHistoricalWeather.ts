import { useCallback, useState } from 'react';
import client from '../api/client';

export type HistoricalPeriod = 'day' | 'week' | 'month';

export interface HistoricalWeatherEntry {
  period: string;
  temperature: number | null;
  waterfall: number | null;
  wind_speed: number | null;
}

export function useHistoricalWeather() {
  const [data, setData] = useState<HistoricalWeatherEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchHistoricalWeather = useCallback(
    async (
      latitude: number,
      longitude: number,
      period: HistoricalPeriod
    ) => {
      setLoading(true);
      setError(null);

      try {
        const res = await client.get('/api/v1/weather/historical', {
          params: { latitude, longitude, period },
        });

        const raw = res.data;

        // API returns an array of objects with keys:
        // { period: string, temperature: number, waterfall: number, wind_speed: number }
        const list: any[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

        const normalized: HistoricalWeatherEntry[] = list.map((item) => ({
          period: typeof item.period === 'string' ? item.period : String(item.period ?? ''),
          temperature:
            typeof item.temperature === 'number' ? item.temperature : null,
          waterfall:
            typeof item.waterfall === 'number' ? item.waterfall : null,
          wind_speed:
            typeof item.wind_speed === 'number' ? item.wind_speed : null,
        }));

        setData(normalized);
        return normalized;
      } catch (e) {
        setError(e);
        setData(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, fetchHistoricalWeather };
}

export default useHistoricalWeather;


