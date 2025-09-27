// pages/index.tsx
import React from "react";
import { useRouter } from "next/router";
import "../assets/css/main_styles.css";
import ArrowIcon from "../assets/icons/arrowIcon";
import DropIcon from "../assets/icons/dropIcon";

const Home: React.FC = () => {
    const router = useRouter();
    
    const advantages = [
        {
            id: 1,
            image: "/images/advantages_img1.png",
            icon: DropIcon,
            title: "Снижаем миллионные риски для промышленности",
            alt: "Снижение рисков для промышленности"
        },
        {
            id: 2,
            image: "/images/advantages_img2.png",
            title: "Точный прогноз на основе передового ИИ",
            alt: "Искусственный интеллект"
        },
        {
            id: 3,
            image: "/images/advantages_img3.png",
            title: "Первое отечественное решение для прогноза паводков",
            alt: "Отечественное решение"
        }
    ];
    const technologies = [
        {
            id: 1,
            image: "/images/technology_img1.png",
            title: "Database",
            description: "Мы аккумулируем и структурируем огромные массивы исторических и текущих данных в надежной реляционной СУБД."
        },
        {
            id: 2,
            image: "/images/technology_img2.png",
            title: "AI",
            description: "Мы разработали собственную ML-модель, которая точно прогнозирует риски затоплений и подтоплений на основе сложных гидрологических данных."
        },
        {
            id: 3,
            image: "/images/technology_img3.png",
            title: "API-интеграция",
            description: "Наше решение в реальном времени использует актуальные данные через API, обеспечивая интеграцию с вашими системами и максимальную достоверность прогнозов."
        }
    ];
    return (
        <main className="main_page">
            <section className="top">
                <div className="top_wrapper">
                    <div className="top_img">
                        <img src="/images/top.webp" alt="" />
                    </div>
                    <div className="top_info_items_wrapper">
                        <div className="top_info_item_wrapper_item">
                            <a href="" className="top_info_item_wrapper_item_link">
                                 <div className="top_info_item_wrapper_item_img">
                                    <img src="/images/aqualert_logo.png" alt="" />
                                </div>
                                <span>
                                    AQUALERT
                                </span>
                            </a>
                            <h1 className="top_info_item_wrapper_item_title">
                                Прогнозируй наступление 
                                затоплений с помощью Искусственного интеллекта 
                            </h1>
                            <a 
                                href="/dashboard" 
                                className="top_info_item_wrapper_item_link2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/dashboard');
                                }}
                            >
                                <span>
                                    Попробовать
                                </span>
                                <ArrowIcon />
                            </a>
                        </div>
                        <div className="top_info_item_wrapper_item2">
                           <div className="top_info_item_wrapper_item_auth_buttons_wrapper">
                                <button 
                                    className="top_info_item_wrapper_item_auth_button"
                                    onClick={() => router.push('/auth/register')}
                                >
                                    Регистрация
                                </button>
                                <button 
                                    className="top_info_item_wrapper_item_auth_button"
                                    onClick={() => router.push('/auth/login')}
                                >
                                    Вход
                                </button>
                           </div>
                           <nav className="top_info_item_wrapper_item_nav">
                            <ul className="top_info_item_wrapper_item_nav_list">
                                <li className="top_info_item_wrapper_item_nav_list_item">
                                    <a href="" className="top_info_item_wrapper_item_nav_link">
                                        О нас
                                    </a>
                                </li>
                                <li className="top_info_item_wrapper_item_nav_list_item">
                                    <a href="" className="top_info_item_wrapper_item_nav_link">
                                        Технологии
                                    </a>
                                </li>
                                <li className="top_info_item_wrapper_item_nav_list_item">
                                    <a href="" className="top_info_item_wrapper_item_nav_link">
                                        Контакты
                                    </a>
                                </li>
                            </ul>
                                
                           </nav>
                        </div>
                    </div>
                </div>
            </section>

            <section className="advantages">
                <div className="advantages_wrapper">
                    <div className="advantages_wrapper_item1">
                        <p className="advantages_wrapper_item_title">
                            Цифровая экосистема, прогнозирующая наступление затоплений и подтоплений, а также других неблагоприятных природных событий
                        </p>
                    </div>
                    <div className="advantages_wrapper_item2">
                        <div className="advantages_grid">
                            {advantages.map((advantage) => (
                                <div key={advantage.id} className="advantage_card">
                                      {advantage.icon && (
                                        <div className="advantage_icon_wrapper">
                                            <div className="advantage_icon">
                                                <advantage.icon />
                                            </div>
                                        </div>
                                        )}
                                    <div className="advantage_img">
                                        <img src={advantage.image} alt={advantage.alt} />
                                    
                                    </div>
                                    <h3 className="advantage_title">{advantage.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="about_us">
                <div className="about_us_wrapper">
                    <h1 className="about_us_title">О нас </h1>
                    <p className="about_us_description">
                        Наша миссия — защищать бизнес и инфраструктуру от разрушительных последствий паводков и подтоплений. Мы создаем интеллектуальную систему прогнозирования на основе AI, чтобы давать возможность принимать упреждающие меры и избегать миллионных убытков.                 
                    </p>
                </div>
            </section>

            <section className="technologies">
                <div className="technologies_wrapper">
                    <h1 className="technologies_title">Технологии</h1>  
                    <div className="technologies_grid">
                            {technologies.map((technology) => (
                                <div key={technology.id} className="technology_card">
                                    <p className="technology_title">{technology.title}</p>
                                    <div className="technology_img">
                                        <img src={technology.image} />
                                    </div>
                                    <p className="technology_description">{technology.description}</p>
                                  
                                </div>
                            ))}
                        </div>

                </div>
            </section>

            <section className="footer">
                <div className="footer_wrapper">
                    <p className="footer_wrapper_info">
                        Работа выполнена при поддержке гранта Фонда содействия инновациям, предоставленного в рамках программы «Студенческий стартап» федерального проекта «Платформа университетского технологического предпринимательства».
                    </p>
                    <div className="footer_wrapper_item">
                        <div className="footer_wrapper_item_wrapper">
                            <p className="footer_wrapper_item_info">
                                © 2025 Aqualert. Все права защищены.
                            </p>
                            <nav className="footer_wrapper_item_nav">
                                <ul className="footer_wrapper_item_nav_list">
                                    <li className="footer_wrapper_item_nav_list_item">
                                        <a href="" className="footer_wrapper_item_nav_link">
                                            ФСИ
                                        </a>
                                    </li>
                                    <li className="footer_wrapper_item_nav_list_item">
                                        <a href="" className="footer_wrapper_item_nav_link">
                                            NeuroLife
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                       
                    </div>
                </div>
            </section>
    
        
        </main>
    );
};

export default Home;
