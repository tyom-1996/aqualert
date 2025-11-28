import React, { useState, useEffect, useMemo } from 'react';
import '../assets/css/dashboard.css';
import router from 'next/router';
import MoonIcon from '../assets/icons/moonIcon';
import WindIcon from '../assets/icons/windIcon';
import DropIcon2 from '../assets/icons/dropIcon2';
import MoonIcon2 from '../assets/icons/moonIcon2';
import SunIcon from '../assets/icons/sunIcon';
import CloudyIcon from '../assets/icons/cloudyIcon';
import GMap, { SelectedPlace } from '../components/GMap';
import { useWeatherForecast, NormalizedHourlyWeather } from '../hooks/useWeatherForecast';
import useHistoricalWeather, {
  HistoricalPeriod,
  HistoricalWeatherEntry,
} from '../hooks/useHistoricalWeather';
import { useFloodingProbability } from '../hooks/useFloodingProbability';
import { useMeteorologicalSituation } from '../hooks/useMeteorologicalSituation';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState<string>('Санкт-Петербург');
  const [selectedPeriod, setSelectedPeriod] = useState<HistoricalPeriod>('week');
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: 59.9375,
    lon: 30.3086,
  });
  const { data: weather, loading: weatherLoading, error: weatherErrorRaw, fetchWeather } = useWeatherForecast();
  const {
    data: historical,
    loading: historicalLoading,
    error: historicalError,
    fetchHistoricalWeather,
  } = useHistoricalWeather();
  const {
    data: flooding,
    loading: floodingLoading,
    error: floodingError,
    fetchFloodingProbability,
  } = useFloodingProbability();
  const {
    data: meteo,
    loading: meteoLoading,
    error: meteoError,
    fetchMeteorologicalSituation,
  } = useMeteorologicalSituation();
  const weatherError =
    typeof weatherErrorRaw === 'string'
      ? weatherErrorRaw
      : weatherErrorRaw
      ? 'Ошибка загрузки погоды'
      : null;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal || showLoader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal, showLoader]);

  // Initial weather & risk for default city (Saint Petersburg) + updates on coords change
  useEffect(() => {
    fetchWeather(coords.lat, coords.lon);
    fetchFloodingProbability(coords.lat, coords.lon);
    fetchMeteorologicalSituation(coords.lat, coords.lon);
  }, [coords.lat, coords.lon, fetchWeather, fetchFloodingProbability, fetchMeteorologicalSituation]);

  // Historical data reacts to coords and selected period only
  useEffect(() => {
    fetchHistoricalWeather(coords.lat, coords.lon, selectedPeriod);
  }, [coords.lat, coords.lon, selectedPeriod, fetchHistoricalWeather]);

  // Debug: смотрим, что возвращает API вероятности затопления
  useEffect(() => {
    if (flooding || floodingError) {
      // eslint-disable-next-line no-console
      console.log('Flooding probability response:', { flooding, floodingLoading, floodingError });
    }
  }, [flooding, floodingLoading, floodingError]);

  // Debug: смотрим, что возвращает API метеорологической обстановки
  useEffect(() => {
    if (meteo || meteoError) {
      // eslint-disable-next-line no-console
      console.log('Meteorological situation response:', {
        meteo,
        meteoLoading,
        meteoError,
      });
    }
  }, [meteo, meteoLoading, meteoError]);

  const getWindDirection = (deg: number | undefined) => {
    if (deg === undefined || isNaN(deg)) return '';
    const directions = ['C', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const getHourlyIcon = (hour: NormalizedHourlyWeather) => {
    const meta = `${hour.icon || ''} ${hour.description || ''}`.toLowerCase();

    const hourNumber = (() => {
      if (!hour.time) return NaN;
      const parts = hour.time.split(':');
      const h = parseInt(parts[0] || '', 10);
      return isNaN(h) ? NaN : h;
    })();

    const isNight =
      !isNaN(hourNumber) && (hourNumber < 6 || hourNumber >= 22);

    if (meta.includes('rain') || meta.includes('дожд')) {
      return <DropIcon2 />;
    }

    if (meta.includes('snow') || meta.includes('снег')) {
      return <DropIcon2 />;
    }

    if (
      meta.includes('storm') ||
      meta.includes('гроза') ||
      meta.includes('thunder')
    ) {
      return <DropIcon2 />;
    }

    if (
      meta.includes('clear') ||
      meta.includes('ясно') ||
      meta.includes('sun')
    ) {
      return isNight ? <MoonIcon2 /> : <SunIcon />;
    }

    if (
      meta.includes('cloud') ||
      meta.includes('облач') ||
      meta.includes('пасмур')
    ) {
      return <CloudyIcon />;
    }

    return isNight ? <MoonIcon2 /> : <CloudyIcon />;
  };

  const getCurrentIcon = () => {
    if (!weather) {
      return <CloudyIcon />;
    }

    const meta = `${weather.icon || ''} ${weather.description || ''}`.toLowerCase();

    const now = new Date();
    const hour = now.getHours();
    const isNight = hour < 6 || hour >= 22;

    if (meta.includes('rain') || meta.includes('дожд')) {
      return <DropIcon2 />;
    }

    if (meta.includes('snow') || meta.includes('снег')) {
      return <DropIcon2 />;
    }

    if (
      meta.includes('storm') ||
      meta.includes('гроза') ||
      meta.includes('thunder')
    ) {
      return <DropIcon2 />;
    }

    if (
      meta.includes('clear') ||
      meta.includes('ясно') ||
      meta.includes('sun')
    ) {
      return isNight ? <MoonIcon2 /> : <SunIcon />;
    }

    if (
      meta.includes('cloud') ||
      meta.includes('облач') ||
      meta.includes('пасмур')
    ) {
      return <CloudyIcon />;
    }

    return isNight ? <MoonIcon2 /> : <CloudyIcon />;
  };

  const handleDownloadReport = () => {
    setShowLoader(true);
    
    // Simulate loading time
    setTimeout(() => {
      setShowLoader(false);
      setShowModal(true);
    }, 2000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLocationConfirm = (place: SelectedPlace) => {
    setSelectedCityName(place.name);
    setCoords({ lat: place.lat, lon: place.lng });
    fetchWeather(place.lat, place.lng);
    fetchFloodingProbability(place.lat, place.lng);
    fetchMeteorologicalSituation(place.lat, place.lng);
  };

  const handlePeriodChange = (period: HistoricalPeriod) => {
    setSelectedPeriod(period);
  };

  const formatHistoricalRow = (entry: HistoricalWeatherEntry) => {
    const date = entry.period || '';

    const temperature = entry.temperature ?? null;
    const precipitation = entry.waterfall ?? null;
    const windSpeed = entry.wind_speed ?? null;

    return {
      date,
      temperature,
      precipitation,
      windSpeed,
    };
  };

  const getFloodingRiskInfo = (probability: number | null) => {
    if (probability == null || isNaN(probability)) {
      return {
        level: 'unknown' as const,
        label: 'Нет данных по риску затопления',
      };
    }

    if (probability < 30) {
      return {
        level: 'low' as const,
        label: 'Низкая угроза затопления',
      };
    }

    if (probability < 70) {
      return {
        level: 'medium' as const,
        label: 'Средняя угроза затопления',
      };
    }

    return {
      level: 'high' as const,
      label: 'Высокая угроза затопления',
    };
  };

  const floodingProbability =
    typeof flooding?.probability === 'number' ? flooding.probability : null;
  const floodingRisk = getFloodingRiskInfo(floodingProbability);
  const floodingPercentDisplay =
    floodingLoading && !floodingError
      ? '...'
      : floodingProbability != null
      ? `${Math.round(floodingProbability)}%`
      : '--';

  const meteoFloodingLabel = useMemo(() => {
    const rawVal =
      (meteo as any)?.raw?.flooding_probability ??
      (meteo as any)?.raw?.floodingProbability ??
      (meteo as any)?.raw?.probability;

    if (!rawVal || typeof rawVal !== 'string') return null;
    const v = rawVal.toLowerCase();
    if (v === 'low') return 'Низкий';
    if (v === 'medium') return 'Средний';
    if (v === 'high') return 'Высокий';
    return null;
  }, [meteo]);

  const summaryFloodingLabel = meteoFloodingLabel || floodingRisk.label;

  const floodingChartData = useMemo(() => {
    const base = floodingProbability ?? 0;
    const p = Math.max(0, Math.min(100, base));

    // Генерируем плавную «волну», заканчивающуюся в текущем значении
    const points = [
      Math.max(5, p * 0.3),
      Math.max(10, p * 0.5),
      Math.max(8, p * 0.35),
      Math.max(15, p * 0.7),
      Math.max(12, p * 0.55),
      p || 20,
    ];

    return points.map((value, index) => ({
      step: index + 1,
      value,
    }));
  }, [floodingProbability]);

  const formatMetric = (value: number | null, suffix: string) => {
    if (value == null || Number.isNaN(value)) return '--';
    return `${value.toFixed(1)}${suffix}`;
  };

  const formatDelta = (value: number | null, suffix: string) => {
    if (value == null || Number.isNaN(value)) return '--';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}${suffix}`;
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard_wrapper">
      <div className="dashboard_left_item">
        <a href="" className="dashboard_left_item_link">
                <div className="dashboard_left_item_img">
                  <img src="/images/aqualert_logo.png" alt="" />
              </div>
              <span>
                  AQUALERT
              </span>
          </a>
        <button className="home-button"   
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
                }}>
          <img src="/images/home_icon.png" alt="" />
        </button>
      </div>

      <div className="dashboard-content">
        {/* Left Column */}
        <div className="left-column">
          {/* Current Weather Section */}
          <div className="weather-card">
            <div className="weather-header">
              <h2>{weather?.cityName || selectedCityName}</h2>
            </div>
            <div className="current-weather">
              <div className="current-temperature-details">
                  {/** Берём первую точку из почасового прогноза как «текущий час» */}
                  {(() => {
                    const currentPoint: NormalizedHourlyWeather | null =
                      weather && weather.hourly.length > 0
                        ? weather.hourly[0]
                        : null;
                    return (
                      <>
                        <div className="temperature">
                          {weatherLoading && !weatherError && '...'}
                          {!weatherLoading &&
                            currentPoint &&
                            currentPoint.temperature !== null &&
                            `${Math.round(currentPoint.temperature)}°`}
                          {!weatherLoading &&
                            !currentPoint &&
                            weather &&
                            weather.temperature !== null &&
                            `${Math.round(weather.temperature)}°`}
                          {!weatherLoading &&
                            ((!currentPoint &&
                              (!weather || weather.temperature === null)) ||
                              (currentPoint &&
                                currentPoint.temperature === null)) &&
                            weatherError &&
                            '--'}
                        </div>
                        <div className="weather-description-icon-wrapper">
                          {currentPoint
                            ? getHourlyIcon(currentPoint)
                            : getCurrentIcon()}
                          <span className="weather-description">
                            {weatherLoading && !weatherError && 'Загружаем погоду...'}
                            {!weatherLoading && weather && weather.description}
                            {!weatherLoading && !weather && weatherError && weatherError}
                          </span>
                        </div>
                      </>
                    );
                  })()}
              </div>

            
              <div className="weather-details2">
                <div className="wind-icon-wrapper">
                  <WindIcon />
                  <span className="wind-info">
                    {weatherLoading && !weatherError && '--'}
                    {!weatherLoading &&
                      weather &&
                      weather.windSpeed !== null &&
                      `${Math.round(weather.windSpeed)} м/с${
                        weather.windDeg != null && getWindDirection(weather.windDeg)
                          ? `, ${getWindDirection(weather.windDeg)}`
                          : ''
                      }`}
                    {!weatherLoading && (!weather || weather.windSpeed === null) && weatherError && '--'}
                  </span>
                </div>
                <div className="wind-icon-wrapper">
                  <DropIcon2 />
                  <span className="wind-info">
                    {weatherLoading && !weatherError && '--'}
                    {!weatherLoading && weather && weather.humidity !== null && `${weather.humidity}%`}
                    {!weatherLoading && (!weather || weather.humidity === null) && weatherError && '--'}
                  </span>
                </div>
            
              </div>
            </div>
            <div className="hourly-forecast">
              {weather && weather.hourly.length > 0 ? (
                weather.hourly.map((hour, index) => (
                  <div key={index} className="forecast-item">
                    <div className="time">{hour.time}</div>
                    <div className="weather-icon">
                      {getHourlyIcon(hour)}
                    </div>
                    <div className="temp">
                      {hour.temperature !== null ? `${Math.round(hour.temperature)}°` : '--'}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="forecast-item">
                    <div className="time">4:00</div>
                    <div className="weather-icon"><MoonIcon2 /></div>
                    <div className="temp">+18°</div>
                  </div>
                  <div className="forecast-item">
                    <div className="time">5:00</div>
                    <div className="weather-icon"><MoonIcon2 /></div>
                    <div className="temp">+19°</div>
                  </div>
                  <div className="forecast-item">
                    <div className="time">6:00</div>
                    <div className="weather-icon"><SunIcon /></div>
                    <div className="temp">+20°</div>
                  </div>
                  <div className="forecast-item">
                    <div className="time">7:00</div>
                    <div className="weather-icon"><SunIcon /></div>
                    <div className="temp">+20°</div>
                  </div>
                  <div className="forecast-item">
                    <div className="time">8:00</div>
                    <div className="weather-icon"><CloudyIcon /></div>
                    <div className="temp">+21°</div>
                  </div>
                  <div className="forecast-item">
                    <div className="time">9:00</div>
                    <div className="weather-icon"><CloudyIcon /></div>
                    <div className="temp">+21°</div>
                  </div>
                  <div className="forecast-item">
                    <div className="time">10:00</div>
                    <div className="weather-icon"><CloudyIcon /></div>
                    <div className="temp">+22°</div>
                  </div>
                  <div className="forecast-item">
                    <div className="time">11:00</div>
                    <div className="weather-icon"><CloudyIcon /></div>
                    <div className="temp">+22°</div>
                  </div>
                  <div className="forecast-item">
                    <div className="time">12:00</div>
                    <div className="weather-icon"><CloudyIcon /></div>
                    <div className="temp">+23°</div>
                  </div>
                  <div className="forecast-item">
                    <div className="time">13:00</div>
                    <div className="weather-icon"><SunIcon /></div>
                    <div className="temp">+23°</div>
                  </div>
                  <div className="forecast-item">
                    <div className="time">14:00</div>
                    <div className="weather-icon"><SunIcon /></div>
                    <div className="temp">+22°</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Alerts Section */}
          <div className="alerts-analysis-wrapper">
            <div className="alert-card">
                <div className="alert-header">
                  <div className="alert-icon">
                    <img src="/images/alert_img.png" alt="" />
                  </div>
                  <h3>Опасные погодные условия</h3>
                </div>
                <div className="alert-description">
                  С 22 августа в бассейнах рек Санкт-Петербурга будет наблюдаться сложная гидрологическая обстановка, связанная с низкой меженью (маловодьем).
                </div>
                <div className="pdf-icon-wrapper">
                    <button className="download-button" onClick={handleDownloadReport}>
                        <span>Скачать отчёт</span>
                      </button>
                    <div className="pdf-icon">
                        <img src="/images/pdf_img5.png" alt="" />
                      </div>
                </div>
                 
              </div>

              {/* Analysis Graph */}
              <div className="analysis-card">
                <h3>График анализа</h3>
                <div className="analysis-content">
                  <p className="analysis-description">
                    <span className="analysis-percentage">
                      {floodingPercentDisplay}
                    </span>
                    {floodingRisk.label}
                  </p>
                  <div className="analysis-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={floodingChartData}
                        margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                      >
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#FFFFFF"
                          strokeWidth={4}
                          dot={{
                            r: 6,
                            stroke: '#FFFFFF',
                            strokeWidth: 3,
                            fill: 'transparent',
                          }}
                          activeDot={{
                            r: 8,
                            stroke: '#FFFFFF',
                            strokeWidth: 4,
                            fill: '#A3D0E8',
                          }}
                          isAnimationActive
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
        </div>

          {/* Summary Table */}
          <div className="summary-card">
            <h3>Сводка</h3>
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Параметр</th>
                  <th>Текущее значение</th>
                  <th>Норма</th>
                  <th>Отклонение</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Температура</td>
                  <td>{formatMetric(meteo?.temperature.current ?? null, '°C')}</td>
                  <td>{formatMetric(meteo?.temperature.normal ?? null, '°C')}</td>
                  <td className="deviation ">
                    {formatDelta(meteo?.temperature.delta ?? null, '°C')}
                  </td>
                </tr>
                <tr>
                  <td>Осадки</td>
                  <td>
                    {formatMetric(
                      (meteo as any)?.raw?.waterfall_current ??
                        meteo?.precipitation.current ??
                        null,
                      ' мм'
                    )}
                  </td>
                  <td>
                    {formatMetric(
                      (meteo as any)?.raw?.waterfall_normal ??
                        meteo?.precipitation.normal ??
                        null,
                      ' мм'
                    )}
                  </td>
                  <td className="deviation ">
                    {formatDelta(
                      (meteo as any)?.raw?.waterfall_delta ??
                        meteo?.precipitation.delta ??
                        null,
                      ' мм'
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Скорость ветра</td>
                  <td>{formatMetric(meteo?.windSpeed.current ?? null, ' м/с')}</td>
                  <td>{formatMetric(meteo?.windSpeed.normal ?? null, ' м/с')}</td>
                  <td className="deviation ">
                    {formatDelta(meteo?.windSpeed.delta ?? null, ' м/с')}
                  </td>
                </tr>
            
              </tbody>
            </table>
            <div className="summary-table-last-row">
                  <p>Риск затопления</p>
                  <p>{summaryFloodingLabel}</p>
                  
                </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Map Section */}
          <div className="map-card">
            <GMap onLocationConfirm={handleLocationConfirm} />
          </div>

          {/* Historical Data */}
          <div className="historical-card">
            <div className="historical-header">
              <h3>Исторические данные</h3>
              <div className="date-filters">
                <button
                  className={`filter-btn ${selectedPeriod === 'day' ? 'active' : ''}`}
                  onClick={() => handlePeriodChange('day')}
                >
                  <span>День</span>
                </button>
                <button
                  className={`filter-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
                  onClick={() => handlePeriodChange('week')}
                >
                  <span>Неделя</span>
                </button>
                <button
                  className={`filter-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
                  onClick={() => handlePeriodChange('month')}
                >
                  <span>Месяц</span>
                </button>
              </div>
            </div>
            <table className="historical-table historical-table-header">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Температура</th>
                  <th>Осадки</th>
                  <th>Скорость ветра</th>
                </tr>
              </thead>
            </table>
            <div className="historical-table-wrapper">
              <table className="historical-table">
                <tbody>
                  {historicalLoading && (
                    <tr>
                      <td colSpan={4}>Загружаем исторические данные…</td>
                    </tr>
                  )}
                  {!historicalLoading && !!historicalError && (
                    <tr>
                      <td colSpan={4}>Ошибка загрузки исторических данных</td>
                    </tr>
                  )}
                  {!historicalLoading &&
                    !historicalError &&
                    historical &&
                    historical.length > 0 &&
                    historical.map((entry, index) => {
                      const row = formatHistoricalRow(entry);
                      return (
                        <tr key={index}>
                          <td>{row.date || '--'}</td>
                          <td>
                            {row.temperature != null ? `${row.temperature.toFixed(1)}°C` : '--'}
                          </td>
                          <td>
                            {row.precipitation != null ? `${row.precipitation} мм` : '--'}
                          </td>
                          <td>
                            {row.windSpeed != null ? `${row.windSpeed} м/с` : '--'}
                          </td>
                        </tr>
                      );
                    })}
                  {!historicalLoading &&
                    !historicalError &&
                    (!historical || historical.length === 0) && (
                      <tr>
                        <td colSpan={4}>Нет данных для выбранного периода</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span className="page active">1</span>
              <span className="page">2</span>
              <span className="page">3</span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Loader Overlay */}
      {showLoader && (
        <div className="loader-overlay">
          <div className="loader-content">
            <div className="dots-loader">
              {[...Array(12)].map((_, index) => (
                <div key={index} className={`dot dot-${index + 1}`}></div>
              ))}
            </div>
            <p className="loader-text">Отчёт формируется</p>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile_logo">
              <img src="/images/mobile_logo.png" alt="" />
            </div>  
            <div className="modal_img">
              <img src="/images/popup_img.png" alt="" />
            </div>
            {/* <div className="modal-header">
              <div className="modal-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12Z" stroke="#248DC5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12L10.5 14.5L16 9" stroke="#248DC5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="modal-title">Аналитический отчет о метеорологической и гидрологической обстановке в бассейне реки Волга</h2>
            </div>
            
            <div className="modal-body">
              <div className="report-details">
                <p><strong>Период анализа:</strong> 22 октября – 28 октября 2023 г.</p>
                <p><strong>Дата составления:</strong> 25 октября 2023 г.</p>
              </div>
              
              <div className="report-section">
                <h3>1. Введение</h3>
                <p>
                  В данном отчете представлен анализ текущей метеорологической и гидрологической обстановки в бассейне реки Волга. 
                  Особое внимание уделено динамике температуры воздуха, количеству осадков и уровню воды в реке. 
                  Данная информация имеет важное значение для планирования навигации, водопользования, 
                  сельского хозяйства и оценки рисков наводнений.
                </p>
              </div>
              
              <div className="report-graph">
                <h4>Динамика среднесуточной температуры воздуха</h4>
                <div className="graph-container">
                  <div className="graph-placeholder">
                    <div className="graph-line astrakhan"></div>
                    <div className="graph-line nizhny"></div>
                    <div className="graph-line yaroslavl"></div>
                    <div className="graph-labels">
                      <span>Астрахань (низовье)</span>
                      <span>Нижний Новгород (среднее течение)</span>
                      <span>Ярославль (верхнее течение)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            
            <div className="modal-footer">
              <button className="modal-download-btn" onClick={handleCloseModal}>
                Скачать отчёт
              </button>
            </div>
          </div>
        </div>
      )}
   
    </div>
  );
};

export default Dashboard;
