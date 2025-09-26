// src/api/user.ts
import client from './client'
import { AxiosResponse } from 'axios'

/** Описание текущего пользователя */
export interface UserProfile {
    id: number
    phone: string
    name?: string
    profile_photo?: string
    profilePhoto?: string
    isPro: boolean
    proExpiresAt: string | null
    createdAt: string
}

/** Описание одного контекста (аккаунт / pro-профиль / магазин) */
export type ContextType = 'account' | 'pro_profile' | 'store'
export interface UserContext {
    type: ContextType
    id: number
    name?: string
    phone?: string     // для личного аккаунта
    profile_photo?: string
    profilePhoto?: string
    isOwned: boolean
}

/** Ответ от GET /user/me/context */
export interface GetContextResponse {
    user: UserProfile
    contexts: UserContext[]
}

/**
 * Получить профиль и контексты текущего пользователя
 */
export const getContexts = (): Promise<AxiosResponse<GetContextResponse>> => {
    return client.get<GetContextResponse>('/user/me/context')
}
