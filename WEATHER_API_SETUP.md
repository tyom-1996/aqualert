# Weather API Setup Instructions

## OpenWeatherMap API Setup

To use real weather data in your dashboard, you need to:

### 1. Get a Free API Key
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Add API Key to Environment
Create a `.env.local` file in your project root and add:

```
NEXT_PUBLIC_WEATHER_API_KEY=your_actual_api_key_here
```

### 3. Features Included
- ✅ Real-time weather data for Saint Petersburg
- ✅ 5-day weather forecast
- ✅ Weather icons from OpenWeatherMap
- ✅ Russian language support
- ✅ Wind direction in Russian (С, СВ, В, etc.)
- ✅ Temperature formatting (+17°, -5°, etc.)
- ✅ Loading and error states

### 4. Fallback Mode
If no API key is provided, the app will show:
- Loading state
- Error message asking for API key
- No actual weather data

### 5. API Limits (Free Tier)
- 1,000 calls per day
- 60 calls per minute
- Perfect for development and small projects

## Usage
The weather data automatically loads when you visit `/dashboard`. The data refreshes every time you reload the page.

## Customization
You can change the default city by modifying the `useWeather("Saint Petersburg")` call in `dashboard.tsx`.
