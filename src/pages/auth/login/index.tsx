import React, { useState } from "react";
import { useRouter } from "next/router";
import "../../../assets/css/login.css";
import { useSignIn } from "../../../hooks/useSignIn";

interface FormData {
    username: string;
    password: string;
}

interface FormErrors {
    username?: string;
    password?: string;
    general?: string;
}

const Login: React.FC = () => {
    const router = useRouter();
    const { signIn, loading: signingIn } = useSignIn();
    
    // Form state
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: ""
    });
    
    // Error state
    const [errors, setErrors] = useState<FormErrors>({});
    
    // Loading state
    const [isLoading, setIsLoading] = useState(false);
    
    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Remove spaces from username field
        const processedValue = name === 'username' 
            ? value.replace(/\s+/g, '') 
            : value;
        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
        
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };
    
    // Form validation
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = "Имя пользователя обязательно";
        }
        
        if (!formData.password.trim()) {
            newErrors.password = "Пароль обязателен";
        } else if (formData.password.length < 6) {
            newErrors.password = "Пароль должен содержать минимум 6 символов";
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
            const res = await signIn({
                username: formData.username.trim(),
                password: formData.password,
            })
            if (!res) throw new Error('sign in failed')
            router.push("/dashboard")
        } catch (error) {
            setErrors({
                general: "Ошибка входа. Проверьте данные и попробуйте снова."
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Handle register link click
    const handleRegisterClick = () => {
        router.push("/auth/register");
    };
    
    return (
        <main className="login_main_page">
                <div className="login_form_wrapper">
                    <h1 className="login_title">Вход</h1>
                    
                    <form onSubmit={handleSubmit} className="login_form">
                        {errors.general && (
                            <div className="error_message general_error">
                                {errors.general}
                            </div>
                        )}
                        
                        <div className="input_group">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Имя пользователя"
                                className={`login_input ${errors.username ? 'error' : ''}`}
                                disabled={isLoading || signingIn}
                            />
                            {errors.username && (
                                <span className="error_message">{errors.username}</span>
                            )}
                        </div>
                        
                        <div className="input_group">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Пароль"
                                className={`login_input ${errors.password ? 'error' : ''}`}
                                disabled={isLoading || signingIn}
                            />
                            {errors.password && (
                                <span className="error_message">{errors.password}</span>
                            )}
                        </div>
                        
                        <button 
                            type="submit" 
                            className="login_button"
                            disabled={isLoading || signingIn}
                        >
                            {isLoading ? "Загрузка..." : "Продолжить"}
                        </button>
                    </form>
                    
                    <div className="login_footer">
                        <span className="login_footer_text">
                            Нет аккаунта?{" "}
                            <button 
                                type="button"
                                className="login_register_link"
                                onClick={handleRegisterClick}
                            >
                                Зарегистрироваться
                            </button>
                        </span>
                    </div>
                </div>
        </main>
    );
};

export default Login;
