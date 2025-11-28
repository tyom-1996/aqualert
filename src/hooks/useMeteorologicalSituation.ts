import { useCallback, useState } from 'react';
import client from '../api/client';

export interface NormalizedMetric {
  current: number | null;
  normal: number | null;
  delta: number | null;
}

export interface MeteorologicalSituation {
  floodingProbability: number | null;
  temperature: NormalizedMetric;
  precipitation: NormalizedMetric;
  waterLevel: NormalizedMetric;
  windSpeed: NormalizedMetric;
  raw?: any;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const n = parseFloat(value.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function normalizeMetric(raw: any, prefix: string): NormalizedMetric {
  return {
    current: toNumber(
      raw?.[`${prefix}_current`] ??
        raw?.[`${prefix}Current`] ??
        raw?.[`${prefix}`]
    ),
    normal: toNumber(
      raw?.[`${prefix}_normal`] ??
        raw?.[`${prefix}Normal`] ??
        raw?.[`${prefix}_norm`]
    ),
    delta: toNumber(
      raw?.[`${prefix}_delta`] ??
        raw?.[`${prefix}Delta`] ??
        raw?.[`${prefix}_diff`]
    ),
  };
}

export function useMeteorologicalSituation() {
  const [data, setData] = useState<MeteorologicalSituation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchMeteorologicalSituation = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);
      setError(null);

      try {
        const res = await client.get(
          '/api/v1/waterlevel/meteorological-situation',
          {
            params: { latitude, longitude },
          }
        );

        const raw = res.data || {};

        const floodingProbability = toNumber(raw.flooding_probability_numeric);

        const normalized: MeteorologicalSituation = {
          floodingProbability,
          temperature: normalizeMetric(raw, 'temperature'),
          // API может использовать как precipitation_*, так и waterfall_*
          precipitation: normalizeMetric(
            {
              ...raw,
              precipitation_current:
                raw.precipitation_current ?? raw.waterfall_current,
              precipitation_normal:
                raw.precipitation_normal ?? raw.waterfall_normal,
              precipitation_delta:
                raw.precipitation_delta ?? raw.waterfall_delta,
            },
            'precipitation'
          ),
          waterLevel: normalizeMetric(raw, 'water_level'),
          windSpeed: normalizeMetric(raw, 'wind_speed'),
          raw,
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
    },
    []
  );

  return { data, loading, error, fetchMeteorologicalSituation };
}

export default useMeteorologicalSituation;


