import React, { useState, useEffect } from 'react';
import '../assets/css/dashboard.css';
import router from 'next/router';
import MoonIcon from '../assets/icons/moonIcon';
import WindIcon from '../assets/icons/windIcon';
import DropIcon2 from '../assets/icons/dropIcon2';
import MoonIcon2 from '../assets/icons/moonIcon2';
import SunIcon from '../assets/icons/sunIcon';
import CloudyIcon from '../assets/icons/cloudyIcon';
import GMap from '../components/GMap';

const Dashboard: React.FC = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
              <h2>Санкт-Петербург</h2>
            </div>
            <div className="current-weather">
              <div className="current-temperature-details">
                  <div className="temperature">+17°</div>
                  <div className="weather-description-icon-wrapper">
                    <MoonIcon />
                    <span className="weather-description">Ясно. Сегодня осадков не ожидается</span>
                  </div>
              </div>

            
              <div className="weather-details2">
                <div className="wind-icon-wrapper">
                  <WindIcon />
                  <span className="wind-info">3 м/с, С3</span>
                </div>
                <div className="wind-icon-wrapper">
                  <DropIcon2 />
                  <span className="wind-info">58%</span>
                </div>
            
              </div>
            </div>
            <div className="hourly-forecast">
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
                        <img src="/images/pdf_img_main.png" alt="" />
                      </div>
                </div>
                 
              </div>

              {/* Analysis Graph */}
              <div className="analysis-card">
                <h3>График анализа</h3>
                <div className="analysis-content">
                  <p className="analysis-description">
                    <span className="analysis-percentage">85%</span> 
                    Высокая 
                    угроза затопления
                  </p>
                  <div className="analysis-chart">
                    <img src="/images/analistic_img.png" alt="" />
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
                  <td>Уровень воды</td>
                  <td>2.8 м</td>
                  <td>3.0 м</td>
                  <td className="deviation ">-0.2 м</td>
                </tr>
                <tr>
                  <td>Осадки</td>
                  <td>15 мм</td>
                  <td>10 мм</td>
                  <td className="deviation ">+5 мм</td>
                </tr>
                <tr>
                  <td>Скорость ветра</td>
                  <td>5 м/с</td>
                  <td>7 м/с</td>
                  <td className="deviation ">-2 м/с</td>
                </tr>
            
              </tbody>
            </table>
            <div className="summary-table-last-row">
                  <p>Риск затопления</p>
                  <p>Высокий</p>
                  
                </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Map Section */}
          <div className="map-card">
            <GMap />
          </div>

          {/* Historical Data */}
          <div className="historical-card">
            <div className="historical-header">
              <h3>Исторические данные</h3>
              <div className="date-filters">
                <button className="filter-btn">
                  <span>День</span></button>
                <button className="filter-btn active">
                  <span>Неделя</span>
                  </button>
                <button className="filter-btn">
                  <span>Месяц</span>
                  </button>
              </div>
            </div>
            <table className="historical-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Параметр</th>
                  <th>Значение</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>21.08.2025</td>
                  <td>Уровень воды</td>
                  <td>3.0 м</td>
                </tr>
                <tr>
                  <td>20.01.2025</td>
                  <td>Осадки</td>
                  <td>10 мм</td>
                </tr>
                <tr>
                  <td>19.01.2025</td>
                  <td>Скорость ветра</td>
                  <td>7 м/с</td>
                </tr>
              </tbody>
            </table>
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
