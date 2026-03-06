"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeCheck, Trophy, MessageSquareText, FileText, Shield, Star, Clock } from "lucide-react"

interface ActivityEntry {
    id: string
    type?: string
    title: string
    description?: string
    created_at?: string
}

interface ActivityTimelineProps {
    activities: ActivityEntry[]
}

const iconMap: Record<string, React.ElementType> = {
    badge: BadgeCheck,
    trophy: Trophy,
    recommendation: MessageSquareText,
    project: FileText,
    verification: Shield,
    achievement: Star,
}

const colorMap: Record<string, string> = {
    badge: "bg-primary/10 text-primary",
    trophy: "bg-chart-4/10 text-chart-4",
    recommendation: "bg-chart-3/10 text-chart-3",
    project: "bg-chart-1/10 text-chart-1",
    verification: "bg-chart-5/10 text-chart-5",
    achievement: "bg-chart-4/10 text-chart-4",
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
    if (activities.length === 0) {
        return (
            <Card className="rounded-2xl border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground text-center py-10">Нет активности</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="rounded-2xl border-border">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
                <div className="relative flex flex-col gap-0">
                    <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border" />
                    {activities.map((entry) => {
                        const type = entry.type ?? "badge"
                        const IconComp = iconMap[type] ?? BadgeCheck
                        const colorClass = colorMap[type] ?? "bg-primary/10 text-primary"
                        return (
                            <div key={entry.id}
                                className="group relative flex gap-4 py-3 transition-colors hover:bg-secondary/30 rounded-xl px-2 -mx-2">
                                <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                                    <IconComp className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1 pt-0.5">
                                    <p className="text-[13px] font-semibold leading-snug text-foreground">{entry.title}</p>
                                    {entry.description && (
                                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{entry.description}</p>
                                    )}
                                    {entry.created_at && (
                                        <p className="mt-1 text-[10px] text-muted-foreground/70">
                                            {new Date(entry.created_at).toLocaleDateString("ru-RU")}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}