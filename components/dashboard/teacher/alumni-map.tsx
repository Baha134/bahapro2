'use client'

import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { BadgeCheck, X, Users, Briefcase, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface AlumniProfile {
    id: string
    full_name?: string | null
    location?: string | null
    gpa?: number | null
}

const cities = [
    { id: 'astana', name: 'Астана', coordinates: [71.4460, 51.1801] as [number, number], color: '#6C5CE7', alumni: 12, company: 'BI Group, Kaspi.kz', topRole: 'Backend Developer', region: 'Акмолинская' },
    { id: 'almaty', name: 'Алматы', coordinates: [76.8897, 43.2220] as [number, number], color: '#00B894', alumni: 28, company: 'Kaspi.kz, Kolesa Group', topRole: 'Full Stack Developer', region: 'Алматинская' },
    { id: 'shymkent', name: 'Шымкент', coordinates: [69.5960, 42.3000] as [number, number], color: '#F97316', alumni: 8, company: 'Jusan Bank', topRole: 'Data Analyst', region: 'Туркестанская' },
    { id: 'karaganda', name: 'Қарағанды', coordinates: [73.1036, 49.8047] as [number, number], color: '#a855f7', alumni: 6, company: 'EPAM Kazakhstan', topRole: 'QA Engineer', region: 'Карагандинская' },
    { id: 'atyrau', name: 'Атырау', coordinates: [51.9231, 47.1167] as [number, number], color: '#3b82f6', alumni: 4, company: 'KazMunaiGaz', topRole: 'DevOps Engineer', region: 'Атырауская' },
    { id: 'aktobe', name: 'Ақтөбе', coordinates: [57.2066, 50.2839] as [number, number], color: '#FDCB6E', alumni: 3, company: 'Halyk Bank', topRole: 'iOS Developer', region: 'Актюбинская' },
    { id: 'pavlodar', name: 'Павлодар', coordinates: [76.9674, 52.2873] as [number, number], color: '#00D2D3', alumni: 5, company: 'Kolesa Group', topRole: 'Android Developer', region: 'Павлодарская' },
    { id: 'oskemen', name: 'Өскемен', coordinates: [82.6278, 49.9483] as [number, number], color: '#f59e0b', alumni: 2, company: 'Samsung R&D', topRole: 'Embedded Engineer', region: 'ВКО' },
    { id: 'taraz', name: 'Тараз', coordinates: [71.3667, 42.9000] as [number, number], color: '#14b8a6', alumni: 3, company: 'Forte Bank', topRole: 'Frontend Developer', region: 'Жамбылская' },
    { id: 'aktau', name: 'Ақтау', coordinates: [51.1801, 43.6527] as [number, number], color: '#ec4899', alumni: 2, company: 'KazTransOil', topRole: 'System Analyst', region: 'Мангистауская' },
]

const regionColors: Record<string, string> = {
    'Акмолинская': '#ede9fe',
    'Алматинская': '#d1fae5',
    'Туркестанская': '#ffedd5',
    'Карагандинская': '#f3e8ff',
    'Атырауская': '#dbeafe',
    'Актюбинская': '#fef9c3',
    'Павлодарская': '#ccfbf1',
    'ВКО': '#fef3c7',
    'Жамбылская': '#ccfbf1',
    'Мангистауская': '#fce7f3',
    'ЗКО': '#e0f2fe',
    'Костанайская': '#f0fdf4',
    'Кызылординская': '#fff7ed',
    'СКО': '#f0f9ff',
}

const WORLD_URL = '/kz.json'

export function AlumniMap({ alumni }: { alumni: AlumniProfile[] }) {
    const [selectedCity, setSelectedCity] = useState<typeof cities[0] | null>(null)
    const [hoveredCity, setHoveredCity] = useState<string | null>(null)
    const [zoom, setZoom] = useState(4)
    const [center, setCenter] = useState<[number, number]>([66, 48])

    const totalAlumni = cities.reduce((sum, c) => sum + c.alumni, 0)

    return (
        <div className="space-y-4">

            {/* Map */}
            <div className="relative overflow-hidden rounded-2xl border border-border"
                style={{ height: 500, background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 60%, #e8f4fd 100%)' }}>
                {/* Zoom controls */}
                <div className="absolute right-4 top-4 z-10 flex flex-col gap-1.5">
                    {[
                        { icon: ZoomIn, action: () => setZoom(z => Math.min(12, z + 1)) },
                        { icon: ZoomOut, action: () => setZoom(z => Math.max(1, z - 1)) },
                        { icon: RotateCcw, action: () => { setZoom(4); setCenter([66, 48]) } },
                    ].map(({ icon: Icon, action }, i) => (
                        <button key={i} onClick={action}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white/95 text-foreground shadow-sm transition-all hover:bg-white hover:shadow-md active:scale-95">
                            <Icon className="h-4 w-4" />
                        </button>
                    ))}
                </div>

                {/* Stats pill */}
                <div className="absolute left-4 top-4 z-10 flex gap-2">
                    <div className="rounded-xl border border-blue-100 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Выпускников</p>
                        <p className="text-2xl font-black text-foreground">{totalAlumni}</p>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Городов</p>
                        <p className="text-2xl font-black text-foreground">{cities.length}</p>
                    </div>
                </div>

                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{ center: center, scale: 800 }}
                    style={{ width: '100%', height: '100%' }}>
                    <ZoomableGroup
                        zoom={zoom}
                        center={center}
                        onMoveEnd={({ zoom: z, coordinates }: any) => {
                            setZoom(z)
                            setCenter(coordinates as [number, number])
                        }}>

                        {/* World background */}
                        <Geographies geography={WORLD_URL}>
                            {({ geographies }: any) =>
                                geographies.map((geo: any) => {
                                    const name = geo.properties.name
                                    const isKZ = name === 'Kazakhstan'
                                    const isNeighbor = ['Russia', 'China', 'Kyrgyzstan', 'Uzbekistan', 'Turkmenistan'].includes(name)
                                    if (!isKZ && !isNeighbor) return null
                                    return (
                                        <Geography key={geo.rsmKey} geography={geo}
                                            style={{
                                                default: {
                                                    fill: isKZ ? '#dbeafe' : '#f1f5f9',
                                                    stroke: isKZ ? '#93c5fd' : '#cbd5e1',
                                                    strokeWidth: isKZ ? 1.2 : 0.4,
                                                    outline: 'none',
                                                },
                                                hover: {
                                                    fill: isKZ ? '#bfdbfe' : '#f1f5f9',
                                                    stroke: isKZ ? '#60a5fa' : '#cbd5e1',
                                                    strokeWidth: isKZ ? 1.5 : 0.4,
                                                    outline: 'none',
                                                },
                                                pressed: { outline: 'none' },
                                            }} />
                                    )
                                })
                            }
                        </Geographies>
                        {/* Kazakhstan regions overlay */}
                        {/* Kazakhstan regions */}
                        <Geographies geography="/kz-regions.geojson">
                            {({ geographies }: any) =>
                                geographies.map((geo: any) => (
                                    <Geography key={geo.rsmKey} geography={geo}
                                        style={{
                                            default: {
                                                fill: geo.properties.color,
                                                stroke: '#93c5fd',
                                                strokeWidth: 0.5,
                                                fillOpacity: 0.6,
                                                outline: 'none',
                                            },
                                            hover: {
                                                fill: geo.properties.color,
                                                stroke: '#6C5CE7',
                                                strokeWidth: 1,
                                                fillOpacity: 0.8,
                                                outline: 'none',
                                            },
                                            pressed: { outline: 'none' },
                                        }} />
                                ))
                            }
                        </Geographies>



                        {/* City markers */}
                        {cities.map((city) => {
                            const isSelected = selectedCity?.id === city.id
                            const isHovered = hoveredCity === city.id
                            const r = Math.max(4, Math.min(10, city.alumni / 3))

                            return (
                                <Marker key={city.id} coordinates={city.coordinates}
                                    onClick={() => setSelectedCity(isSelected ? null : city)}
                                    onMouseEnter={() => setHoveredCity(city.id)}
                                    onMouseLeave={() => setHoveredCity(null)}>

                                    {/* Glow rings */}
                                    <circle r={r + 10} fill={city.color} fillOpacity={isSelected ? 0.2 : 0.07} />
                                    <circle r={r + 5} fill={city.color} fillOpacity={isSelected ? 0.3 : 0.12} />

                                    {/* Main dot */}
                                    <circle r={r} fill={city.color} stroke="white" strokeWidth={isSelected ? 2.5 : 1.5}
                                        style={{
                                            cursor: 'pointer',
                                            filter: isSelected || isHovered ? `drop-shadow(0 0 8px ${city.color})` : `drop-shadow(0 1px 3px rgba(0,0,0,0.3))`,
                                            transform: isSelected ? 'scale(1.3)' : 'scale(1)',
                                            transition: 'all 0.2s',
                                        }} />

                                    {/* Count */}
                                    <text textAnchor="middle" y="0.35em"
                                        style={{ fontSize: r > 6 ? 5 : 4, fill: 'white', fontWeight: 'bold', pointerEvents: 'none' }}>
                                        {city.alumni}
                                    </text>

                                    {/* Label */}
                                    <text textAnchor="middle" y={-(r + 8)}
                                        style={{
                                            fontSize: isSelected || isHovered ? 7.5 : 6.5,
                                            fontWeight: isSelected || isHovered ? 'bold' : '600',
                                            fill: isSelected || isHovered ? city.color : '#1e293b',
                                            pointerEvents: 'none',
                                        }}>
                                        {city.name}
                                    </text>
                                </Marker>
                            )
                        })}
                    </ZoomableGroup>
                </ComposableMap>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/50 bg-white/80 px-4 py-1.5 text-[10px] font-medium text-slate-600 backdrop-blur-sm shadow-sm">
                    🖱 Scroll — зум · Drag — перемещение · Click — детали
                </div>
            </div>

            {/* Selected city panel */}
            {selectedCity && (
                <div className="rounded-2xl border-2 p-5 transition-all"
                    style={{ borderColor: selectedCity.color, backgroundColor: `${selectedCity.color}08` }}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg"
                                style={{ backgroundColor: selectedCity.color, boxShadow: `0 8px 24px ${selectedCity.color}40` }}>
                                {selectedCity.name[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-black text-foreground">{selectedCity.name}</h3>
                                    <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                                        style={{ backgroundColor: selectedCity.color }}>
                                        {selectedCity.region}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    {selectedCity.company}
                                </p>
                                <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold"
                                    style={{ color: selectedCity.color }}>
                                    <BadgeCheck className="h-4 w-4" />
                                    Топ роль: {selectedCity.topRole}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedCity(null)}
                            className="rounded-xl p-2 text-muted-foreground hover:bg-secondary transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                        {[
                            { label: 'Выпускников', value: selectedCity.alumni },
                            { label: 'Трудоустроено', value: Math.floor(selectedCity.alumni * 0.87) },
                            { label: 'Компаний', value: selectedCity.company.split(',').length },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-2xl border border-border bg-white/70 p-4 text-center backdrop-blur-sm">
                                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* City pills */}
            <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                    <button key={city.id}
                        onClick={() => setSelectedCity(selectedCity?.id === city.id ? null : city)}
                        className="flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-sm"
                        style={{
                            borderColor: selectedCity?.id === city.id ? city.color : 'var(--border)',
                            backgroundColor: selectedCity?.id === city.id ? `${city.color}15` : 'var(--card)',
                            color: selectedCity?.id === city.id ? city.color : 'var(--muted-foreground)',
                        }}>
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: city.color }} />
                        {city.name}
                        <span className="font-black">{city.alumni}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}