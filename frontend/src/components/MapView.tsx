import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { REGION_VIEWPORTS, type RegionId } from '../types/map'

function ViewportController({ region }: { region: RegionId }) {
  const map = useMap()
  useEffect(() => {
    const viewport = REGION_VIEWPORTS[region]
    map.setView(viewport.center, viewport.zoom)
  }, [map, region])
  return null
}

export function MapView({ selectedRegion }: { selectedRegion: RegionId }) {
  const viewport = REGION_VIEWPORTS[selectedRegion]
  return (
    <div className="h-[480px] overflow-hidden rounded-xl border border-slate-200 shadow-sm sm:h-[560px]">
      <MapContainer center={viewport.center} zoom={viewport.zoom} scrollWheelZoom className="h-full w-full" aria-label="Interactive map of Delhi and Uttar Pradesh">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ViewportController region={selectedRegion} />
      </MapContainer>
    </div>
  )
}
