import { useCallback, useState } from 'react';
import client from '../api/client';

export interface FloodingProbabilityData {
  probability: number | null;
  raw?: any;
}

export function useFloodingProbability() {
  const [data, setData] = useState<FloodingProbabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchFloodingProbability = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);
      setError(null);

      try {
        const res = await client.get('/api/v1/waterlevel/flooding-probability', {
          params: { latitude, longitude },
        });

        const raw = res.data;

        // Универсальная нормализация: пытаемся достать вероятность из разных возможных полей
        let probability: number | null = null;

        if (typeof raw === 'number') {
          probability = raw;
        } else if (raw && typeof raw === 'object') {
          const candidate =
            (raw as any).probability ??
            (raw as any).flooding_probability ??
            (raw as any).risk ??
            (raw as any).value;

          probability = typeof candidate === 'number' ? candidate : null;
        }

        const normalized: FloodingProbabilityData = {
          probability,
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

  return { data, loading, error, fetchFloodingProbability };
}

export default useFloodingProbability;


