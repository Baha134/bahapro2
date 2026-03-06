"use client"

import { useState, useCallback } from "react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Brain, Wrench, GraduationCap, TrendingUp, Target, Zap } from "lucide-react"

interface Skill {
    name: string
    level: number
    category?: string
}

interface BalanceRadarProps {
    skills: Skill[]
    gpa: number
    maxGpa?: number
    achievements: any[]
}

const chartConfig = {
    score: { label: "Score", color: "#6366f1" },
}

export function BalanceRadar({ skills, gpa, maxGpa = 4.0, achievements }: BalanceRadarProps) {
    const [activeDimension, setActiveDimension] = useState<string | null>(null)

    // Считаем hard skills — навыки с category === 'hard' или все
    const hardSkills = skills.filter(s => s.category === 'hard' || !s.category)
    const softSkills = skills.filter(s => s.category === 'soft')

    const hardScore = hardSkills.length > 0
        ? Math.round(hardSkills.reduce((a, s) => a + s.level, 0) / hardSkills.length)
        : 0

    const softScore = softSkills.length > 0
        ? Math.round(softSkills.reduce((a, s) => a + s.level, 0) / softSkills.length)
        : Math.round(skills.reduce((a, s) => a + s.level, 0) / (skills.length || 1))

    const verifiedCount = achievements.filter((a: any) => a.verified || a.badges?.verified).length
    const gpaPercent = Math.round((gpa / maxGpa) * 100)
    const achievementPercent = achievements.length > 0
        ? Math.round((verifiedCount / achievements.length) * 100)
        : 0
    const academicScore = Math.round(gpaPercent * 0.7 + achievementPercent * 0.3)

    const overallScore = Math.round((hardScore + softScore + academicScore) / 3)

    const radarData = [
        { dimension: "Hard Skills", score: hardScore, fullMark: 100 },
        { dimension: "Soft Skills", score: softScore, fullMark: 100 },
        { dimension: "Academic", score: academicScore, fullMark: 100 },
    ]

    const dimensionDetails: Record<string, {
        icon: React.ElementType
        color: string
        label: string
        breakdown: { name: string; value: string }[]
    }> = {
        "Hard Skills": {
            icon: Wrench,
            color: "#6366f1",
            label: "Technical Competency",
            breakdown: hardSkills.slice(0, 4).map(s => ({ name: s.name, value: `${s.level}/100` })),
        },
        "Soft Skills": {
            icon: Brain,
            color: "#22c55e",
            label: "Interpersonal Competency",
            breakdown: softSkills.slice(0, 4).map(s => ({ name: s.name, value: `${s.level}/100` })),
        },
        "Academic": {
            icon: GraduationCap,
            color: "#f59e0b",
            label: "Academic Standing",
            breakdown: [
                { name: "GPA", value: `${gpa.toFixed(2)} / ${maxGpa}` },
                { name: "Verified Badges", value: `${verifiedCount} / ${achievements.length}` },
            ],
        },
    }

    const handleChartClick = useCallback((state: any) => {
        if (state?.activePayload?.length > 0) {
            const clicked = state.activePayload[0]?.payload
            if (clicked) {
                setActiveDimension(prev => prev === clicked.dimension ? null : clicked.dimension)
            }
        }
    }, [])

    const activeDetail = activeDimension ? dimensionDetails[activeDimension] : null

    return (
        <Card className="rounded-2xl border-border">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                            <Target className="h-4 w-4 text-primary" />
                            Student Balance Profile
                        </CardTitle>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Click any axis to explore dimension details
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5">
                        <Zap className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-bold text-primary">{overallScore}</span>
                        <span className="text-[10px] text-muted-foreground">/ 100</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-5">
                {/* Dimension pills */}
                <div className="mb-5 grid grid-cols-3 gap-3">
                    {radarData.map((d) => {
                        const det = dimensionDetails[d.dimension]
                        const Icon = det.icon
                        const isActive = activeDimension === d.dimension
                        return (
                            <button
                                key={d.dimension}
                                onClick={() => setActiveDimension(prev => prev === d.dimension ? null : d.dimension)}
                                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${isActive
                                    ? "border-primary/40 bg-primary/5 shadow-sm"
                                    : "border-border bg-secondary/30 hover:border-primary/20 hover:bg-secondary/50"
                                    }`}
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: `${det.color}15` }}>
                                    <Icon className="h-4 w-4" style={{ color: det.color }} />
                                </div>
                                <span className="text-[11px] font-medium text-muted-foreground">{d.dimension}</span>
                                <span className="text-lg font-bold" style={{ color: det.color }}>{d.score}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Radar Chart */}
                <ChartContainer config={chartConfig} className="mx-auto h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}
                            onClick={handleChartClick} style={{ cursor: "pointer" }}>
                            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                            <PolarAngleAxis dataKey="dimension"
                                tick={({ x, y, payload }: any) => {
                                    const det = dimensionDetails[payload.value]
                                    const isActive = activeDimension === payload.value
                                    return (
                                        <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                                            style={{
                                                fill: isActive ? det.color : "#64748b",
                                                fontSize: isActive ? 13 : 12, fontWeight: isActive ? 700 : 500
                                            }}>
                                            {payload.value}
                                        </text>
                                    )
                                }}
                            />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                            <ChartTooltip content={<ChartTooltipContent formatter={(v) => [`${v}/100`, "Score"]} />} />
                            <defs>
                                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                            <Radar name="Score" dataKey="score" stroke="#6366f1"
                                fill="url(#balanceGradient)" fillOpacity={1} strokeWidth={2.5}
                                dot={{ r: 5, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
                                activeDot={{ r: 7, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Detail panel */}
                {activeDetail && activeDimension && (
                    <div className="mt-5 rounded-xl border p-4 transition-all"
                        style={{ borderColor: `${activeDetail.color}30`, backgroundColor: `${activeDetail.color}05` }}>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                                style={{ backgroundColor: `${activeDetail.color}15` }}>
                                <activeDetail.icon className="h-3.5 w-3.5" style={{ color: activeDetail.color }} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-foreground">{activeDimension}</h4>
                                <p className="text-[10px] text-muted-foreground">{activeDetail.label}</p>
                            </div>
                            <div className="ml-auto flex items-center gap-1">
                                <TrendingUp className="h-3.5 w-3.5" style={{ color: activeDetail.color }} />
                                <span className="text-sm font-bold" style={{ color: activeDetail.color }}>
                                    {radarData.find(d => d.dimension === activeDimension)?.score ?? 0}/100
                                </span>
                            </div>
                        </div>
                        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${radarData.find(d => d.dimension === activeDimension)?.score ?? 0}%`,
                                    backgroundColor: activeDetail.color
                                }} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {activeDetail.breakdown.map((item) => (
                                <div key={item.name}
                                    className="flex items-center justify-between rounded-lg bg-card px-3 py-2">
                                    <span className="text-[11px] font-medium text-muted-foreground">{item.name}</span>
                                    <span className="text-[11px] font-bold text-foreground">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}