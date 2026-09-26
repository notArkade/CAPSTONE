import type { Region } from '../types/map'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json() as Promise<T>
}

export const api = {
  health: () => request<{ status: string; service: string }>('/api/health'),
  regions: () => request<Region[]>('/api/regions'),
}
