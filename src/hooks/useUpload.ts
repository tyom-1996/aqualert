import { useState, useCallback } from 'react'
import { AxiosError } from 'axios'
import { uploadFile, UploadResponse, UploadError } from '../api/upload'

export interface UseUploadReturn {
  uploadFile: (folder: string, file: File) => Promise<void>
  loading: boolean
  error: string | null
  data: UploadResponse | null
  reset: () => void
}

export function useUpload(): UseUploadReturn {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<UploadResponse | null>(null)

  const uploadFileHandler = useCallback(async (folder: string, file: File) => {
    setLoading(true)
    setError(null)
    setData(null)
    
    try {
      const response = await uploadFile(folder, file)
      setData(response)
    } catch (err: any) {
      let message = 'Error uploading file'
      
      if (err instanceof AxiosError && err.response?.data) {
        // Handle Axios error with response data
        if (typeof err.response.data === 'object' && err.response.data !== null) {
          message = (err.response.data as any)?.message || message
        }
      } else if (err instanceof Error) {
        // Handle standard Error objects
        message = err.message
      }
      
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    uploadFile: uploadFileHandler,
    loading,
    error,
    data,
    reset,
  }
} 