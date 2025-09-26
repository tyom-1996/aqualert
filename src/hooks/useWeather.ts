import { useState, useEffect } from 'react';
import { weatherService, WeatherData, ForecastData } from '../services/weatherService';

interface UseWeatherReturn {
    currentWeather: WeatherData | null;
    forecast: ForecastData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useWeather = (city: string = 'Saint Petersburg'): UseWeatherReturn => {
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeatherData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch current weather and forecast in parallel
            const [currentData, forecastData] = await Promise.all([
                weatherService.getCurrentWeather(city),
                weatherService.getForecast(city)
            ]);

            if (currentData) {
                setCurrentWeather(currentData);
            } else {
                setError('Не удалось загрузить текущую погоду');
            }

            if (forecastData) {
                setForecast(forecastData);
            } else {
                setError('Не удалось загрузить прогноз погоды');
            }
        } catch (err) {
            setError('Ошибка при загрузке данных о погоде');
            console.error('Weather fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherData();
    }, [city]);

    return {
        currentWeather,
        forecast,
        loading,
        error,
        refetch: fetchWeatherData
    };
};
