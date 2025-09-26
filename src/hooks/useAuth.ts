import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import {
    requestOtp as apiRequestOtp,
    verifyOtp as apiVerifyOtp,
    checkLock as apiCheckLock,
    registerUser as apiRegisterUser,
    loginWithPassword as apiLoginWithPassword,
    requestResetPasswordOtpApi,
    resetPasswordVerifyOtpApi,
    resetPasswordApi,
    checkResetPasswordTimer as apiCheckResetPasswordTimer,
    VerifyOtpResponse,
    RegisterUserResponse,
    LoginResponse,
    User,
    Context,
} from '../api/auth';

interface RequestOtpResponse {
    success: boolean
    isRegistered: boolean
    retryAfter?: number;
}

export interface UseAuthReturn {
    requestOtp: (phone: string) => Promise<RequestOtpResponse | null>;
    loadingRequestOtp: boolean;
    errorRequestOtp: string | null;
    dataRequestOtp: RequestOtpResponse | null;

    verifyOtp: (phone: string, otp: string) => Promise<void>;
    loadingVerifyOtp: boolean;
    errorVerifyOtp: any;
    setErrorVerifyOtp: Dispatch<SetStateAction<any>>;
    dataVerifyOtp: VerifyOtpResponse | null;


    checkLock: (phone: string) => Promise<void>;
    loadingCheckLock: boolean;
    errorCheckLock: string | null;
    dataCheckLock: any;
    clearCheckLock: () => void;


    registerUser: (phone: string, password: string) => Promise<void>;
    loadingRegisterUser: boolean;
    errorRegisterUser: string | null;
    dataRegisterUser: RegisterUserResponse | null;

    loginWithPassword: (phone: string, password: string, rememberMe: boolean) => Promise<void>;
    loadingLogin: boolean;
    errorLogin: any;
    setErrorLogin: Dispatch<SetStateAction<string | null>>;
    dataLogin: LoginResponse | null;

    requestResetPasswordOtp: (phone: string) => Promise<void>;
    loadingResetPasswordRequestOtp: boolean;
    errorResetPasswordRequestOtp: any | null;
    dataResetPasswordRequestOtp: { success: boolean } | null;
    setErrorResetPasswordRequestOtp: Dispatch<SetStateAction<object | null>>;

    verifyResetPasswordOtp: (phone: string, otp: string) => Promise<void>;
    loadingResetPasswordVerifyOtp: boolean;
    errorResetPasswordVerifyOtp: any;
    setErrorResetPasswordVerifyOtp: Dispatch<SetStateAction<any>>;
    dataResetPasswordVerifyOtp: { valid: boolean } | null;

    resetPassword: (phone: string, otp: string, newPassword: string) => Promise<void>;
    loadingResetPassword: boolean;
    errorResetPassword: string | null;
    setErrorResetPassword: Dispatch<SetStateAction<any>>;
    dataResetPassword: { success: boolean; token: string; refreshToken: string; user: User; contexts: Context[] } | null;
    setDataResetPassword: Dispatch<SetStateAction<{ success: boolean } | null>>;

    checkResetPasswordTimer: (phone: string) => Promise<number>;
    loadingCheckResetPasswordTimer: boolean;
    errorCheckResetPasswordTimer: string | null;
    dataCheckResetPasswordTimer: { remainingSeconds: number } | null;
}

export function useAuth(): UseAuthReturn {
    const [loadingRequestOtp, setLoadingRequestOtp] = useState(false);
    const [errorRequestOtp, setErrorRequestOtp] = useState<string | null>(null);
    const [dataRequestOtp, setDataRequestOtp] = useState<any>(null);

    const [loadingCheckLock, setLoadingCheckLock] = useState(false);
    const [errorCheckLock, setErrorCheckLock] = useState<string | null>(null);
    const [dataCheckLock, setDataCheckLock] = useState<any>(null);

    const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false);
    const [errorVerifyOtp, setErrorVerifyOtp] = useState<any>(null);
    const [dataVerifyOtp, setDataVerifyOtp] = useState<VerifyOtpResponse | null>(null);

    const [loadingRegisterUser, setLoadingRegisterUser] = useState(false);
    const [errorRegisterUser, setErrorRegisterUser] = useState<string | null>(null);
    const [dataRegisterUser, setDataRegisterUser] = useState<RegisterUserResponse | null>(null);

    const [loadingLogin, setLoadingLogin] = useState(false);
    const [errorLogin, setErrorLogin] = useState<string | null>(null);
    const [dataLogin, setDataLogin] = useState<LoginResponse | null>(null);

    const requestOtp = useCallback(async (phone: string) => {
        setLoadingRequestOtp(true);
        setErrorRequestOtp(null);
        try {
            const res = await apiRequestOtp(phone);
            setDataRequestOtp(res.data);
            return res.data as RequestOtpResponse
        } catch (err: any) {
            setErrorRequestOtp(err?.response?.data?.message || err.message);
            return null;
        } finally {
            setLoadingRequestOtp(false);
        }
    }, []);

    const checkLock = useCallback(async (phone: string) => {
        setLoadingCheckLock(true);
        setErrorCheckLock(null);
        try {
            const res = await apiCheckLock(phone);
            setDataCheckLock(res.data);
        } catch (err: any) {
            setDataCheckLock(err.response.data)
            setErrorCheckLock(err?.response?.data?.message || err.message);
        } finally {
            setLoadingCheckLock(false);
        }
    }, []);

    const verifyOtp = useCallback(async (phone: string, otp: string) => {
        setLoadingVerifyOtp(true);
        setErrorVerifyOtp(null);
        try {
            const res = await apiVerifyOtp(phone, otp);
            setDataVerifyOtp(res.data);
        } catch (err: any) {
            setErrorVerifyOtp(err?.response?.data || err.message);
        } finally {
            setLoadingVerifyOtp(false);
        }
    }, []);

    const registerUser = useCallback(async (phone: string, password: string) => {
        setLoadingRegisterUser(true);
        setErrorRegisterUser(null);
        try {
            const res = await apiRegisterUser(phone, password);
            setDataRegisterUser(res.data);
        } catch (err: any) {
            setErrorRegisterUser(err?.response?.data?.message || err.message);
        } finally {
            setLoadingRegisterUser(false);
        }
    }, []);

    const loginWithPassword = useCallback(async (phone: string, password: string, rememberMe: boolean) => {
        setLoadingLogin(true);
        setErrorLogin(null);
        try {
            const res = await apiLoginWithPassword(phone, password, rememberMe);
            setDataLogin(res.data);
        } catch (err: any) {
            setErrorLogin(err?.response?.data || err.message);
        } finally {
            setLoadingLogin(false);
        }
    }, []);

    const [loadingResetPasswordRequestOtp, setLoadingResetPasswordRequestOtp] = useState(false);
    const [errorResetPasswordRequestOtp, setErrorResetPasswordRequestOtp] = useState<object | null>(null);
    const [dataResetPasswordRequestOtp, setDataResetPasswordRequestOtp] = useState<{ success: boolean } | null>(null);

    const requestResetPasswordOtp = useCallback(async (phone: string) => {
        setLoadingResetPasswordRequestOtp(true);
        setErrorResetPasswordRequestOtp(null);
        try {
            const res = await requestResetPasswordOtpApi(phone);
            setDataResetPasswordRequestOtp(res.data);
        } catch (err: any) {
            setErrorResetPasswordRequestOtp(err?.response?.data || err.message);
        } finally {
            setLoadingResetPasswordRequestOtp(false);
        }
    }, []);

    const [loadingResetPasswordVerifyOtp, setLoadingResetPasswordVerifyOtp] = useState(false);
    const [errorResetPasswordVerifyOtp, setErrorResetPasswordVerifyOtp] = useState<any>(null);
    const [dataResetPasswordVerifyOtp, setDataResetPasswordVerifyOtp] = useState<{ valid: boolean } | null>(null);

    const verifyResetPasswordOtp = useCallback(async (phone: string, otp: string) => {
        setLoadingResetPasswordVerifyOtp(true);
        setErrorResetPasswordVerifyOtp(null);
        try {
            const res = await resetPasswordVerifyOtpApi(phone, otp);
            setDataResetPasswordVerifyOtp(res.data);
        } catch (err: any) {
            setErrorResetPasswordVerifyOtp(err?.response?.data || err.message);
        } finally {
            setLoadingResetPasswordVerifyOtp(false);
        }
    }, []);

    const [loadingResetPassword, setLoadingResetPassword] = useState(false);
    const [errorResetPassword, setErrorResetPassword] = useState<string | null>(null);
    const [dataResetPassword, setDataResetPassword] = useState<any>(null);

    const [loadingCheckResetPasswordTimer, setLoadingCheckResetPasswordTimer] = useState(false);
    const [errorCheckResetPasswordTimer, setErrorCheckResetPasswordTimer] = useState<string | null>(null);
    const [dataCheckResetPasswordTimer, setDataCheckResetPasswordTimer] = useState<{ remainingSeconds: number } | null>(null);

    const resetPassword = useCallback(async (phone: string, otp: string, newPassword: string) => {
        setLoadingResetPassword(true);
        setErrorResetPassword(null);
        try {
            const res = await resetPasswordApi(phone, otp, newPassword);
            setDataResetPassword(res.data);
        } catch (err: any) {
            setErrorResetPassword(err?.response?.data?.message || err.message);
        } finally {
            setLoadingResetPassword(false);
        }
    }, []);

    const checkResetPasswordTimer = useCallback(async (phone: string): Promise<number> => {
        setLoadingCheckResetPasswordTimer(true);
        setErrorCheckResetPasswordTimer(null);
        try {
            const res = await apiCheckResetPasswordTimer(phone);
            setDataCheckResetPasswordTimer(res.data);
            return res.data.remainingSeconds;
        } catch (err: any) {
            setErrorCheckResetPasswordTimer(err?.response?.data?.message || err.message);
            return 0;
        } finally {
            setLoadingCheckResetPasswordTimer(false);
        }
    }, []);


    const clearCheckLock = () => {
        setErrorCheckLock(null);
        setDataCheckLock(null);
    };


    return {
        requestOtp,
        loadingRequestOtp,
        errorRequestOtp,
        dataRequestOtp,

        verifyOtp,
        loadingVerifyOtp,
        errorVerifyOtp,
        setErrorVerifyOtp,
        dataVerifyOtp,

        checkLock,
        loadingCheckLock,
        errorCheckLock,
        dataCheckLock,
        clearCheckLock,

        registerUser,
        loadingRegisterUser,
        errorRegisterUser,
        dataRegisterUser,

        loginWithPassword,
        loadingLogin,
        errorLogin,
        setErrorLogin,
        dataLogin,

        requestResetPasswordOtp,
        loadingResetPasswordRequestOtp,
        errorResetPasswordRequestOtp,
        dataResetPasswordRequestOtp,
        setErrorResetPasswordRequestOtp,

        verifyResetPasswordOtp,
        loadingResetPasswordVerifyOtp,
        errorResetPasswordVerifyOtp,
        setErrorResetPasswordVerifyOtp,
        dataResetPasswordVerifyOtp,

        resetPassword,
        loadingResetPassword,
        errorResetPassword,
        setErrorResetPassword,
        dataResetPassword,
        setDataResetPassword,

        checkResetPasswordTimer,
        loadingCheckResetPasswordTimer,
        errorCheckResetPasswordTimer,
        dataCheckResetPasswordTimer,
    };
}
