import React, { useState } from "react";
import { useRouter } from "next/router";
import "../../../assets/css/login.css";
import { useSignUpIndividual } from "../../../hooks/useSignUpIndividual";
import { useSignUpCorporation } from "../../../hooks/useSignUpCorporation";
import axios from "axios";

interface FormData {
    accountType: 'individual' | 'legal';
    fullName: string;
    email: string;
    organizationName?: string;
    inn?: string;
    password: string;
    agreeToTerms: boolean;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    organizationName?: string;
    inn?: string;
    password?: string;
    agreeToTerms?: string;
    general?: string;
}

const Register: React.FC = () => {
    const router = useRouter();
    const { signUp: signUpIndividual, loading: loadingIndividual, error: errorIndividual } = useSignUpIndividual();
    const { signUp: signUpCorporation, loading: loadingCorporation, error: errorCorporation } = useSignUpCorporation();
    
    // Form state
    const [formData, setFormData] = useState<FormData>({
        accountType: 'individual',
        fullName: "",
        email: "",
        organizationName: "",
        inn: "",
        password: "",
        agreeToTerms: false
    });
    
    // Error state
    const [errors, setErrors] = useState<FormErrors>({});
    
    // Loading state
    const [isLoading, setIsLoading] = useState(false);
    // Success popup state
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Handle account type change
    const handleAccountTypeChange = (type: 'individual' | 'legal') => {
        setFormData(prev => ({
            ...prev,
            accountType: type,
            organizationName: type === 'individual' ? '' : prev.organizationName,
            inn: type === 'individual' ? '' : prev.inn
        }));
        
        // Clear related errors
        setErrors(prev => ({
            ...prev,
            organizationName: undefined,
            inn: undefined
        }));
    };
    
    // Form validation
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = "ФИО обязательно";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Почта обязательна";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Некорректный формат почты";
        }
        
        if (formData.accountType === 'legal') {
            if (!formData.organizationName?.trim()) {
                newErrors.organizationName = "Наименование организации обязательно";
            }
            if (!formData.inn?.trim()) {
                newErrors.inn = "ИНН обязателен";
            } else if (!/^\d{10}$|^\d{12}$/.test(formData.inn)) {
                newErrors.inn = "ИНН должен содержать 10 или 12 цифр";
            }
        }
        
        if (!formData.password.trim()) {
            newErrors.password = "Пароль обязателен";
        } else if (formData.password.length < 6) {
            newErrors.password = "Пароль должен содержать минимум 6 символов";
        }
        
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "Необходимо согласиться с пользовательским соглашением";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);

        try {
            if (formData.accountType === 'individual') {
                const res = await signUpIndividual({
                    email: formData.email,
                    username: formData.fullName,
                    password: formData.password,
                });
                if (!res) throw new Error('sign up failed');
            } else {
                const res = await signUpCorporation({
                    email: formData.email,
                    inn: formData.inn || '',
                    name: formData.fullName,
                    org_name: formData.organizationName || '',
                    password: formData.password,
                    username: formData.fullName,
                });
                if (!res) throw new Error('sign up failed');
            }

            setShowSuccess(true);
        } catch (error: unknown) {
            let generalMessage = "Ошибка регистрации. Проверьте данные и попробуйте снова.";
            if (axios.isAxiosError(error)) {
                const data: any = error.response?.data;
                const errorsArray = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.errors)
                        ? data.errors
                        : [];

                const messages = errorsArray.map((e: any) => String(e?.message || "").toLowerCase());
                const rawString = typeof data === "string" ? data.toLowerCase() : "";

                if (messages.some((m: string) => m.includes("username already taken")) || rawString.includes("username already taken")) {
                    generalMessage = "Имя пользователя уже занято";
                }
            } else if (error instanceof Error) {
                generalMessage = error.message;
            }

            setErrors({
                general: generalMessage
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Handle login link click
    const handleLoginClick = () => {
        router.push("/auth/login");
    };
    
    return (
        <main className="login_main_page">
            <div className={`login_form_wrapper ${formData.accountType === 'individual' ? 'login_form_wrapper1' : 'login_form_wrapper2'}`}>
                <h1 className="login_title">Регистрация</h1>
                
                {/* Account Type Selection */}
                <div className="account_type_selector">
                    <button
                        type="button"
                        className={`account_type_button ${formData.accountType === 'individual' ? 'active' : ''}`}
                        onClick={() => handleAccountTypeChange('individual')}
                    >
                        Физ. лицо
                    </button>
                    <button
                        type="button"
                        className={`account_type_button ${formData.accountType === 'legal' ? 'active' : ''}`}
                        onClick={() => handleAccountTypeChange('legal')}
                    >
                        Юр. лицо
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="login_form">
                    {errors.general && (
                        <div className="error_message general_error">
                            {errors.general}
                        </div>
                    )}
                    
                    <div className="input_group">
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="ФИО"
                            className={`login_input ${errors.fullName ? 'error' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.fullName && (
                            <span className="error_message">{errors.fullName}</span>
                        )}
                    </div>
                    
                    <div className="input_group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Почта"
                            className={`login_input ${errors.email ? 'error' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <span className="error_message">{errors.email}</span>
                        )}
                    </div>
                    
                    {formData.accountType === 'legal' && (
                        <>
                            <div className="input_group">
                                <input
                                    type="text"
                                    name="organizationName"
                                    value={formData.organizationName}
                                    onChange={handleInputChange}
                                    placeholder="Наименование организации"
                                    className={`login_input ${errors.organizationName ? 'error' : ''}`}
                                    disabled={isLoading}
                                />
                                {errors.organizationName && (
                                    <span className="error_message">{errors.organizationName}</span>
                                )}
                            </div>
                            
                            <div className="input_group">
                                <input
                                    type="number"
                                    name="inn"
                                    value={formData.inn}
                                    onChange={handleInputChange}
                                    placeholder="ИНН"
                                    className={`login_input ${errors.inn ? 'error' : ''}`}
                                    disabled={isLoading}

                                />
                                {errors.inn && (
                                    <span className="error_message">{errors.inn}</span>
                                )}
                            </div>
                        </>
                    )}
                    
                    <div className="input_group">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Пароль"
                            className={`login_input ${errors.password ? 'error' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <span className="error_message">{errors.password}</span>
                        )}
                    </div>
                    
                    <div className="terms_checkbox_group">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange}
                            className="terms_checkbox"
                            disabled={isLoading}
                        />
                        <label className="terms_label">
                            Я прочитал{" "}
                            <a href="#" className="terms_link">
                                пользовательское соглашения
                            </a>
                        </label>
                    </div>
                    {errors.agreeToTerms && (
                        <span className="error_message">{errors.agreeToTerms}</span>
                    )}
                    
                    <button 
                        type="submit" 
                        className="login_button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Загрузка..." : "Зарегестрироваться"}
                    </button>
                    
                </form>
                
                <div className="login_footer">
                    <span className="login_footer_text">
                        Есть аккаунта?{" "}
                        <button 
                            type="button"
                            className="login_register_link"
                            onClick={handleLoginClick}
                        >
                            Войти
                        </button>
                    </span>
                </div>
            </div>

            {showSuccess && (
                <div className="popup_overlay">
                    <div className="popup_container">
                        <h2 className="popup_title">Регистрация прошла успешно</h2>
                        <p className="popup_text">Вы успешно зарегистрировались.</p>
                        <button
                            type="button"
                            className="popup_button"
                            onClick={handleLoginClick}
                        >
                            Перейти к входу
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Register;
