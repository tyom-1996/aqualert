// src/api/auth.ts
import client from './client'
import { AxiosResponse } from 'axios'

// ==== Interfaces ====

// Response from verifyOtp
export interface VerifyOtpResponse {
    isNewUser: boolean;
}

// Response after registering a user
export interface RegisterUserResponse {
    id: number;
    phone: string;
    is_pro: boolean;
    pro_expires_at: string | null;
    contexts?: object;
    user?: object;
    token?: string;
    refreshToken?: string;
}

// User object
export interface User {
    id: number;
    phone: string;
    profile_photo: string;
    isPro: boolean;
    proExpiresAt: string | null;
}

// Contexts linked to user (account, store, pro)
export type ContextType = 'account' | 'pro_profile' | 'store';

export interface Context {
    type: ContextType;
    id: number;
    name: string;
    profile_photo: string;
    phone: string;
    isOwned: boolean;
}

// Login response
export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: User;
    contexts: Context[];
}

export interface CheckLockResponse {
    ok: boolean;
    message: string;
    lockDuration: string;
    secsLeft: number;
}


// ==== API functions ====

// 1) Request OTP (code)
export const requestOtp = (phone: string): Promise<AxiosResponse<{ success: boolean }>> => {
    return client.post('/auth/request-otp', { phone });
};

// 2) Verify OTP (code)
export const verifyOtp = (phone: string, otp: string): Promise<AxiosResponse<VerifyOtpResponse>> => {
    return client.post('/auth/verify-otp', { phone, otp });
};

export const checkLock = (phone: string): Promise<AxiosResponse<CheckLockResponse>> => {
    return client.post('/auth/check-lock', { phone });
};

// 3) Register new user
export const registerUser = (phone: string, password: string): Promise<AxiosResponse<RegisterUserResponse>> => {
    return client.post('/auth/register', { phone, password });
};

// 4) Login with password
export const loginWithPassword = (phone: string, password: string, rememberMe: boolean): Promise<AxiosResponse<LoginResponse>> => {
    return client.post('/auth/login-password', { phone, password, rememberMe });
};

// 5) Request OTP for password reset
export const requestResetPasswordOtpApi = (phone: string): Promise<AxiosResponse<{ success: boolean }>> => {
    return client.post('/auth/request-password-reset', { phone });
};

// 6) Verify OTP for password reset
export const resetPasswordVerifyOtpApi = (phone: string, otp: string): Promise<AxiosResponse<{ valid: boolean }>> => {
    return client.post('/auth/verify-password-reset', { phone, otp });
};

// 7) Save new password after reset
export const resetPasswordApi = (phone: string, otp: string, newPassword: string): Promise<AxiosResponse<{ success: boolean }>> => {
    return client.post('/auth/reset-password', { phone, otp, newPassword });
};

// 8) Check password reset timer
export const checkResetPasswordTimer = (phone: string): Promise<AxiosResponse<{ remainingSeconds: number }>> => {
    return client.post('/auth/check-rps-timer', { phone });
};
