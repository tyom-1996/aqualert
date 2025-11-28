import type { NextApiRequest, NextApiResponse } from 'next';

type WeatherApiResponse = {
  temperature: number;
  description: string;
  windSpeed: number;
  windDeg: number;
  humidity: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherApiResponse | { error: string }>
) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'OPENWEATHER_API_KEY is not set on the server' });
    return;
  }

  // Default to Saint Petersburg coordinates if not provided
  const lat = req.query.lat ? Number(req.query.lat) : 59.9375;
  const lon = req.query.lon ? Number(req.query.lon) : 30.3086;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch weather data' });
      return;
    }

    const data = await response.json();

    const payload: WeatherApiResponse = {
      temperature: data.main?.temp,
      description: data.weather?.[0]?.description ?? '',
      windSpeed: data.wind?.speed ?? 0,
      windDeg: data.wind?.deg ?? 0,
      humidity: data.main?.humidity ?? 0,
    };

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error while fetching weather data' });
  }
}


