// Пути, для которых не требуется авторизация и не делаем авто-рефреш
export const NO_AUTH_PATHS = [
    '/auth/request-otp',
    '/auth/verify-otp',
    '/auth/register',
    '/auth/login-password',
    '/auth/request-password-reset',
    '/auth/verify-password-reset',
    '/auth/reset-password',
    '/api/v1/auth/refresh',
    '/api/v1/auth/sign_up/individual',
    '/api/v1/auth/sign_up/corporation',
    '/api/v1/auth/sign_in',
    '/auth/refresh',
    '/auth/refresh-token',
];

// Пути, для которых токен ставим, но при 401 не вызываем рефреш
export const OPTIONAL_AUTH_PATHS = [
    '/products',
    '/catalog',
];
