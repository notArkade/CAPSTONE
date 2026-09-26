export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Primary navigation">
        <a className="text-xl font-bold tracking-tight text-slate-900" href="#home">Equi<span className="text-emerald-600">Map</span></a>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <a className="text-slate-950" href="#home">Home</a>
          <a href="#about">About</a>
        </div>
      </nav>
    </header>
  )
}
