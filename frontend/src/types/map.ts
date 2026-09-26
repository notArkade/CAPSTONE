export type RegionId = 'ALL' | 'DL' | 'UP'

export interface Region {
  id: string
  code: string
  name: string
  region_type: string
}

export interface MapViewport {
  center: [number, number]
  zoom: number
}

export const REGION_VIEWPORTS: Record<RegionId, MapViewport> = {
  ALL: { center: [28.55, 79.15], zoom: 7 },
  DL: { center: [28.6139, 77.209], zoom: 10 },
  UP: { center: [27.1, 80.9], zoom: 7 },
}

export const LAYERS = ['All', 'Healthcare', 'Education', 'Transportation', 'Emergency Services'] as const
