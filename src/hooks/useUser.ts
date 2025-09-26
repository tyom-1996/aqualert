// src/hooks/useUser.ts
import { useState, useCallback } from 'react'
import { AxiosError } from 'axios'
import { getContexts, GetContextResponse } from '../api/user'

export interface UseUserReturn {
    fetchContext: () => Promise<void>
        loadingGetContext: boolean
    errorGetContext: string | null
    dataGetContext: GetContextResponse | null
}

export function useUser(): UseUserReturn {
    const [loadingGetContext, setLoadingGetContext] = useState<boolean>(false)
    const [errorGetContext, setErrorGetContext]     = useState<any>(null)
    const [dataGetContext, setDataGetContext]  = useState<GetContextResponse | null>(null)

    const fetchContext = useCallback(async () => {
        setLoadingGetContext(true)
        setErrorGetContext(null)
        try {
            const res = await getContexts()
            setDataGetContext(res.data)
        } catch (err: any) {
            // @ts-ignore
            const message = (err as AxiosError)?.response?.data?.message || err.message || 'Error fetching profile'
            setErrorGetContext(message)
        } finally {
            setLoadingGetContext(false)
        }
    }, [])

    return {
        fetchContext,
        loadingGetContext,
        errorGetContext,
        dataGetContext,
    }
}
