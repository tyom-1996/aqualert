import client from './client'

export interface UploadResponse {
  success: boolean
  file: {
    filename: string
    path: string
    folder: string
  }
}

export interface UploadError {
  message: string
  status?: number
}

export const uploadFile = async (folder: string, file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await client.post<UploadResponse>(`/upload/${folder}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
} 