import { useEffect, useState } from 'react'
import { MapControls } from '../components/MapControls'
import { MapView } from '../components/MapView'
import { api } from '../services/api'
import type { Region, RegionId } from '../types/map'

const fallbackRegions: Region[] = [
  { id: 'DL', code: 'DL', name: 'Delhi', region_type: 'region' },
  { id: 'UP', code: 'UP', name: 'Uttar Pradesh', region_type: 'region' },
]

export function Home() {
  const [regions, setRegions] = useState<Region[]>(fallbackRegions)
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('ALL')
  const [apiState, setApiState] = useState<'loading' | 'ready' | 'unavailable'>('loading')

  useEffect(() => {
    api.regions().then((data) => { setRegions(data); setApiState('ready') }).catch(() => setApiState('unavailable'))
  }, [])

  return <main id="home" className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
    <section className="max-w-3xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">EquiMap · Version 0.1</p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Explore Urban Inequality</h1>
      <p className="mt-5 text-lg leading-8 text-slate-600">EquiMap is a foundation for exploring how access to essential services may differ across urban areas. Analytical data and scores are not available yet.</p>
      <p className="mt-3 text-sm font-medium text-slate-700">Initial coverage: Delhi &amp; Uttar Pradesh</p>
    </section>
    <section className="mt-10" aria-labelledby="map-heading">
      <h2 id="map-heading" className="sr-only">Map explorer</h2>
      <MapControls regions={regions} selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      {apiState === 'loading' && <p className="mt-3 text-sm text-slate-500">Checking the EquiMap backend…</p>}
      {/* {apiState === 'unavailable' && <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">Backend unavailable. The map remains usable with the initial region configuration.</p>} */}
      <div className="mt-5"><MapView selectedRegion={selectedRegion} /></div>
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Future accessibility legend <span className="font-normal text-slate-500">— placeholder only; no scores are shown.</span></p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          <span><i className="mr-2 inline-block h-3 w-3 rounded-full bg-emerald-500" />Good access</span>
          <span><i className="mr-2 inline-block h-3 w-3 rounded-full bg-amber-400" />Moderate access</span>
          <span><i className="mr-2 inline-block h-3 w-3 rounded-full bg-red-500" />Poor access</span>
        </div>
      </div>
    </section>
    {/* <section id="about" className="mt-14 border-t border-slate-200 pt-8 text-sm leading-6 text-slate-600"><h2 className="text-lg font-semibold text-slate-900">About this foundation</h2><p className="mt-2">This release establishes a map, regional API, and PostGIS-ready database schema. It does not make claims about service availability or inequality.</p></section> */}
  </main>
}
