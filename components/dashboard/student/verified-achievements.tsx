"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, BadgeCheck, Code2, Brain, Trophy, FileText, Star, Cpu, Palette, Shield } from "lucide-react"

interface Achievement {
    id: string
    badges?: {
        name?: string
        description?: string
        rarity?: string
        category?: string
        icon?: string
    }
    verified?: boolean
    earned_at?: string
    verifier_name?: string
    verifier_title?: string
    verifier_department?: string
}

interface VerifiedAchievementsProps {
    achievements: Achievement[]
}

const iconMap: Record<string, React.ElementType> = {
    code: Code2, brain: Brain, trophy: Trophy,
    file: FileText, star: Star, cpu: Cpu,
    palette: Palette, shield: Shield,
}

const categoryConfig: Record<string, { bg: string; iconBg: string; border: string; iconColor: string }> = {
    skill: { bg: "bg-chart-1/5", iconBg: "bg-chart-1/12", border: "border-chart-1/15 hover:border-chart-1/40", iconColor: "text-chart-1" },
    academic: { bg: "bg-chart-4/5", iconBg: "bg-chart-4/12", border: "border-chart-4/15 hover:border-chart-4/40", iconColor: "text-chart-4" },
    competition: { bg: "bg-chart-3/5", iconBg: "bg-chart-3/12", border: "border-chart-3/15 hover:border-chart-3/40", iconColor: "text-chart-3" },
    certification: { bg: "bg-chart-5/5", iconBg: "bg-chart-5/12", border: "border-chart-5/15 hover:border-chart-5/40", iconColor: "text-chart-5" },
    default: { bg: "bg-primary/5", iconBg: "bg-primary/12", border: "border-primary/15 hover:border-primary/40", iconColor: "text-primary" },
}

export function VerifiedAchievements({ achievements }: VerifiedAchievementsProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const verifiedCount = achievements.filter(a => a.verified).length

    if (achievements.length === 0) {
        return (
            <Card className="rounded-2xl border-border">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Award className="h-4 w-4 text-primary" />
                        Verified Achievements
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground text-center py-10">
                        Пока нет достижений
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="rounded-2xl border-border">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
                    <span className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        Verified Achievements
                    </span>
                    <Badge variant="secondary" className="rounded-lg px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {verifiedCount} verified
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {achievements.map((item) => {
                        const category = item.badges?.category ?? "default"
                        const config = categoryConfig[category] ?? categoryConfig.default
                        const iconKey = item.badges?.icon ?? "star"
                        const IconComp = iconMap[iconKey] ?? Star
                        const initials = (item.verifier_name ?? "")
                            .split(" ").map((n: string) => n[0]).join("").slice(0, 2)

                        return (
                            <div
                                key={item.id}
                                className="group relative"
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div className={`relative flex flex-col items-center gap-2.5 rounded-xl border px-3 py-4 transition-all duration-200 ${config.bg} ${config.border} cursor-default hover:shadow-sm`}>
                                    {item.verified && (
                                        <div className="absolute top-2 right-2">
                                            <BadgeCheck className="h-3.5 w-3.5 text-chart-3" />
                                        </div>
                                    )}
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                                        <IconComp className={`h-5 w-5 ${config.iconColor}`} />
                                    </div>
                                    <p className="text-center text-[12px] font-semibold leading-tight text-foreground">
                                        {item.badges?.name ?? "Achievement"}
                                    </p>
                                    <p className="line-clamp-2 text-center text-[10px] leading-snug text-muted-foreground">
                                        {item.badges?.description ?? ""}
                                    </p>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-[10px] text-muted-foreground">
                                            {item.earned_at ? new Date(item.earned_at).toLocaleDateString("ru-RU") : ""}
                                        </span>
                                        {item.verified ? (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-chart-3/10 px-1.5 py-0.5 text-[9px] font-medium text-chart-3">
                                                <BadgeCheck className="h-2.5 w-2.5" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Hover tooltip */}
                                {hoveredId === item.id && item.verified && item.verifier_name && (
                                    <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2">
                                        <div className="rounded-xl border border-border bg-card p-3.5 shadow-lg">
                                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                Confirmed by
                                            </p>
                                            <div className="flex items-start gap-2.5">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                    <span className="text-[11px] font-bold text-primary">{initials}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[12px] font-semibold text-foreground">{item.verifier_name}</p>
                                                    {item.verifier_title && (
                                                        <p className="text-[10px] leading-snug text-muted-foreground">{item.verifier_title}</p>
                                                    )}
                                                    {item.verifier_department && (
                                                        <p className="text-[10px] leading-snug text-muted-foreground">{item.verifier_department}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-border bg-card" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}