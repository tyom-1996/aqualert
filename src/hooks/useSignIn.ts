import { useCallback, useState } from 'react'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export interface SignInPayload {
    username: string
    password: string
}

export interface SignInResponse {
    access_token: string
    refresh_token: string
    expires_in?: number
}

export function useSignIn() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<unknown>(null)

    const signIn = useCallback(async (payload: SignInPayload): Promise<SignInResponse | null> => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.post(`${baseURL}/api/v1/auth/sign_in`, payload)
            const data = res.data || {}

            const at = data?.access_token || data?.token
            const rt = data?.refresh_token || data?.refreshToken
            const expires = data?.expires_in
            if (!at || !rt) throw new Error('Invalid sign in response')

            localStorage.setItem('token', at)
            localStorage.setItem('refreshToken', rt)

            return { access_token: at, refresh_token: rt, expires_in: expires }
        } catch (e) {
            setError(e)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    return { signIn, loading, error }
}

export default useSignIn


