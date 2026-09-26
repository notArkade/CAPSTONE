import { LAYERS, type Region, type RegionId } from '../types/map'

interface Props {
  regions: Region[]
  selectedRegion: RegionId
  onRegionChange: (region: RegionId) => void
}

export function MapControls({ regions, selectedRegion, onRegionChange }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(180px,1.2fr)]">
      <label className="sr-only" htmlFor="region">Region</label>
      <select id="region" value={selectedRegion} onChange={(event) => onRegionChange(event.target.value as RegionId)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none">
        <option value="ALL">All regions</option>
        {regions.map((region) => <option key={region.id} value={region.code}>{region.name}</option>)}
      </select>
      <label className="sr-only" htmlFor="layer">Future analytical layer</label>
      <select id="layer" disabled aria-label="Future analytical layer, unavailable in version 0.1" className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500">
        {LAYERS.map((layer) => <option key={layer}>{layer}{layer === 'All' ? ' layers (coming soon)' : ' (coming soon)'}</option>)}
      </select>
      <label className="sr-only" htmlFor="search">Search area</label>
      <input id="search" type="search" placeholder="Search area (coming soon)" disabled className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500" />
    </div>
  )
}
