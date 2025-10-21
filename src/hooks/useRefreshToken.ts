import { useCallback, useState } from 'react'
import axios from 'axios'

// Uses NEXT_PUBLIC_API_BASE_URL if provided, otherwise falls back to same origin
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export interface RefreshResponse {
    access_token: string
    expires_in?: number
    refresh_token: string
}

/**
 * React hook to manually refresh auth tokens via POST /api/v1/auth/refresh
 * It saves tokens into localStorage under keys 'token' and 'refreshToken'.
 * Returns { refresh, loading, error }.
 */
export function useRefreshToken() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<unknown>(null)

    const refresh = useCallback(async (): Promise<RefreshResponse | null> => {
        setLoading(true)
        setError(null)
        try {
            const storedRt = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null
            if (!storedRt) {
                throw new Error('No refresh token in storage')
            }

            // prefer new endpoint shape
            let data: any
            try {
                const res = await axios.post(
                    `${baseURL}/api/v1/auth/refresh`,
                    { refresh_token: storedRt },
                    { withCredentials: false }
                )
                data = res.data
            } catch (e) {
                // fallback to legacy endpoint if necessary
                const res = await axios.post(
                    `${baseURL}/auth/refresh-token`,
                    { refreshToken: storedRt },
                    { withCredentials: false }
                )
                data = res.data
            }

            const accessToken = data?.access_token || data?.token || data?.accessToken
            const refreshToken = data?.refresh_token || data?.refreshToken
            const expiresIn = data?.expires_in

            if (!accessToken || !refreshToken) {
                throw new Error('Invalid refresh response')
            }

            localStorage.setItem('token', accessToken)
            localStorage.setItem('refreshToken', refreshToken)

            const normalized: RefreshResponse = {
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: typeof expiresIn === 'number' ? expiresIn : undefined,
            }

            return normalized
        } catch (e) {
            setError(e)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    return { refresh, loading, error }
}

export default useRefreshToken


