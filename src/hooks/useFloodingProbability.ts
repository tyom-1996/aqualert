import { useCallback, useState } from 'react';
import client from '../api/client';

export interface FloodingProbabilityData {
  probability: number | null;
  description?: string | null;
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

        // Отладочный вывод для проверки структуры ответа
        console.log('Flooding probability API response:', raw);
        console.log('Response type:', typeof raw);
        console.log('Response keys:', raw && typeof raw === 'object' ? Object.keys(raw) : 'not an object');

        // Универсальная нормализация: пытаемся достать вероятность из разных возможных полей
        let probability: number | null = null;
        let description: string | null = null;

        if (typeof raw === 'number') {
          probability = raw;
        } else if (raw && typeof raw === 'object') {
          const candidate =
            (raw as any).probability ??
            (raw as any).flooding_probability ??
            (raw as any).floodingProbability ??
            (raw as any).risk ??
            (raw as any).value;

          probability = typeof candidate === 'number' ? candidate : null;
          
          // Извлекаем description - проверяем все возможные варианты
          description =
            (raw as any).description ??
            (raw as any).description_text ??
            (raw as any).descriptionText ??
            (raw as any).desc ??
            (raw as any).text ??
            null;
          
          console.log('Extracted description:', description);
        }

        const normalized: FloodingProbabilityData = {
          probability,
          description,
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


