import { useCallback, useState } from 'react'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export interface SignUpCorporationPayload {
    email: string
    inn: string
    name: string
    org_name: string
    password: string
    username: string
}

export interface SignUpResponse {
    access_token: string
    refresh_token: string
    expires_in?: number
}

export function useSignUpCorporation() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<unknown>(null)

    const signUp = useCallback(async (payload: SignUpCorporationPayload): Promise<SignUpResponse | null> => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.post(`${baseURL}/api/v1/auth/sign_up/corporation`, payload)
            const data = res.data || {}

            const at = data?.access_token || data?.token
            const rt = data?.refresh_token || data?.refreshToken
            const expires = data?.expires_in
            if (!at || !rt) throw new Error('Invalid sign up response')

            localStorage.setItem('token', at)
            localStorage.setItem('refreshToken', rt)

            return { access_token: at, refresh_token: rt, expires_in: expires }
        } catch (e) {
            setError(e)
            throw e
        } finally {
            setLoading(false)
        }
    }, [])

    return { signUp, loading, error }
}

export default useSignUpCorporation


