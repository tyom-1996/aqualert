import { useState, useEffect } from 'react';

interface GeolocationData {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
}

interface UseGeolocationReturn {
    location: GeolocationData | null;
    loading: boolean;
    error: string | null;
    requestLocation: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
    const [location, setLocation] = useState<GeolocationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCityFromCoordinates = async (lat: number, lon: number): Promise<{ city: string; country: string }> => {
        try {
            // Using reverse geocoding to get city name
            const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo_key';
            
            if (apiKey === 'demo_key') {
                // Mock data for demo
                return {
                    city: 'Yerevan',
                    country: 'Armenia'
                };
            }

            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('Geocoding API error');
            }
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    city: data[0].name,
                    country: data[0].country
                };
            }
            
            return {
                city: 'Unknown',
                country: 'Unknown'
            };
        } catch (err) {
            console.error('Geocoding error:', err);
            return {
                city: 'Unknown',
                country: 'Unknown'
            };
        }
    };

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser');
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const { city, country } = await getCityFromCoordinates(latitude, longitude);
                    
                    setLocation({
                        latitude,
                        longitude,
                        city,
                        country
                    });
                } catch (err) {
                    setError('Failed to get location information');
                    console.error('Location error:', err);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                let errorMessage = 'Failed to get location';
                
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = 'Location access denied by user';
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case err.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }
                
                setError(errorMessage);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    };

    return {
        location,
        loading,
        error,
        requestLocation
    };
};
