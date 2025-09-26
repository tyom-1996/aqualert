// import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
// import { NO_AUTH_PATHS, OPTIONAL_AUTH_PATHS } from '../authPaths'
// import {headers} from "next/headers";
//
// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
//
// const client = axios.create({
//     baseURL,
//     withCredentials: true,    // ключевой момент: шлём куки автоматом
// })
//
// function startsWithAny(url = '', list: string[]) {
//     return list.some(p => url.startsWith(p))
// }
//
// client.interceptors.request.use(
//     (config: InternalAxiosRequestConfig) => {
//         const url = config.url || ''
//         if (!startsWithAny(url, NO_AUTH_PATHS)) {
//             const ctx = typeof window !== 'undefined' ? localStorage.getItem('currentContext') : null;
//             if (ctx) {
//                 try {
//                     const { type, id } = JSON.parse(ctx);
//                     config.headers['X-Context-Type'] = type;
//                     config.headers['X-Context-Id'] = id.toString();
//                     console.log(config.headers['X-Context-Type'], config.headers['X-Context-Id'], 'hoooo');
//                 } catch {
//                     /* ignore malformed context */
//                 }
//             }
//         }
//
//         return config
//     },
//     error => Promise.reject(error)
// )
//
// // убираем response-interceptor полностью, просто пробрасываем ошибку
// client.interceptors.response.use(
//     response => response,
//     error    => Promise.reject(error)
// )
//
// export default client
