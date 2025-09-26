import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { NO_AUTH_PATHS, OPTIONAL_AUTH_PATHS } from '../authPaths'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.localboard.ru'

const client = axios.create({ baseURL })

function startsWithAny(url = '', list: string[]) {
    return list.some(p => url.startsWith(p))
}

// Очередь отложенных запросов
let isRefreshing = false
let failedQueue: Array<{
    resolve: (value?: any) => void
    reject: (error: any) => void
    config: AxiosRequestConfig
}> = []

function processQueue(error: any, newToken: string | null = null) {
    console.log(`Processing queue with ${failedQueue.length} failed requests, error:`, error, 'newToken:', newToken ? 'present' : 'absent')
    
    failedQueue.forEach(prom => {
        if (error) {
            console.log('Rejecting failed request due to refresh error')
            prom.reject(error)
        } else {
            if (newToken) {
                console.log('Retrying failed request with new token')
                prom.config.headers = {
                    ...prom.config.headers,
                    Authorization: `Bearer ${newToken}`,
                }
            }
            prom.resolve(client(prom.config))
        }
    })
    failedQueue = []
}

client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const url = config.url || ''

        if (startsWithAny(url, NO_AUTH_PATHS)) {
            console.log('Request to no-auth path:', url)
            return config
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (token) {
            console.log('Adding token to request:', url, 'Token present:', token.substring(0, 20) + '...')
            config.headers.Authorization = `Bearer ${token}`
        } else {
            console.log('No token found for request:', url)
        }

        if (!startsWithAny(url, NO_AUTH_PATHS)) {
            const ctx = typeof window !== 'undefined' ? localStorage.getItem('currentContext') : null
            if (ctx) {
                try {
                    const { type, id } = JSON.parse(ctx)
                    config.headers['X-Context-Type'] = type
                    config.headers['X-Context-Id'] = id.toString()
                } catch {
                    /* ignore malformed context */
                }
            }
        }

        return config
    },
    error => Promise.reject(error)
)

client.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const origReq = error.config as AxiosRequestConfig
        const url = origReq?.url || ''

        if (startsWithAny(url, NO_AUTH_PATHS)) {
            return Promise.reject(error)
        }

        if (error.response?.status === 401 && startsWithAny(url, OPTIONAL_AUTH_PATHS)) {
            return Promise.reject(error)
        }

        if (error.response?.status === 401) {
            const storedRt = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null
            const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            
            console.log('401 error detected, current token:', currentToken ? 'present' : 'absent')
            console.log('Refresh token available:', storedRt ? 'present' : 'absent')
            
            if (!storedRt) {
                console.log('No refresh token found, removing token and rejecting')
                localStorage.removeItem('token')
                return Promise.reject(error)
            }

            if (isRefreshing) {
                console.log('Token refresh already in progress, queuing request')
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: origReq })
                })
            }

            console.log('Starting token refresh...')
            isRefreshing = true

            return new Promise(async (resolve, reject) => {
                try {
                    console.log('Calling refresh-token endpoint...')
                    console.log('Base URL:', baseURL)
                    console.log('Full URL:', `${baseURL}/auth/refresh-token`)
                    
                    // Create a separate axios instance to avoid infinite loops with interceptors
                    const refreshClient = axios.create({ baseURL })
                    const { data } = await refreshClient.post('/auth/refresh-token', {
                        refreshToken: storedRt,
                    })

                    console.log('Refresh token response:', data)

                    // Validate response structure
                    if (!data.token || !data.refreshToken) {
                        throw new Error('Invalid response structure from refresh token endpoint')
                    }

                    const { token: newAt, refreshToken: newRt } = data
                    console.log('Token refresh successful, updating localStorage')

                    // Save new tokens to localStorage
                    localStorage.setItem('token', newAt)
                    localStorage.setItem('refreshToken', newRt)

                    processQueue(null, newAt)

                    origReq.headers = {
                        ...origReq.headers,
                        Authorization: `Bearer ${newAt}`,
                    }
                    resolve(client(origReq))
                } catch (e) {
                    console.error('Token refresh failed:', e)
                    if (e.response) {
                        console.error('Response status:', e.response.status)
                        console.error('Response data:', e.response.data)
                    }
                    // Remove tokens on refresh failure
                    localStorage.removeItem('token')
                    localStorage.removeItem('refreshToken')
                    processQueue(e, null)
                    reject(e)
                } finally {
                    isRefreshing = false
                }
            })
        }

        return Promise.reject(error)
    }
)

export default client

// Test function for debugging refresh token (remove in production)
export const testRefreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
        console.error('No refresh token found in localStorage')
        return
    }
    
    console.log('Testing refresh token endpoint...')
    console.log('Refresh token:', refreshToken.substring(0, 20) + '...')
    
    try {
        const refreshClient = axios.create({ baseURL })
        const response = await refreshClient.post('/auth/refresh-token', {
            refreshToken
        })
        console.log('Refresh token test successful:', response.data)
        return response.data
    } catch (error) {
        console.error('Refresh token test failed:', error)
        if (error.response) {
            console.error('Response status:', error.response.status)
            console.error('Response data:', error.response.data)
        }
        throw error
    }
}
