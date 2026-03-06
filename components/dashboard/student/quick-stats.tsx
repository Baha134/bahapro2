"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, FolderKanban, MessageSquareText, Award } from "lucide-react"

interface QuickStatsProps {
    jobMatches?: number
    projects?: number
    recommendations?: number
    achievements?: number
}

export function QuickStats({
    jobMatches = 0,
    projects = 0,
    recommendations = 0,
    achievements = 0,
}: QuickStatsProps) {
    const stats = [
        {
            label: "Job Matches",
            value: jobMatches,
            change: "Вакансии для вас",
            icon: <Briefcase className="h-5 w-5" />,
            color: "text-primary bg-primary/10",
        },
        {
            label: "Projects",
            value: projects,
            change: "В портфолио",
            icon: <FolderKanban className="h-5 w-5" />,
            color: "text-chart-3 bg-chart-3/10",
        },
        {
            label: "Recommendations",
            value: recommendations,
            change: "От преподавателей",
            icon: <MessageSquareText className="h-5 w-5" />,
            color: "text-chart-4 bg-chart-4/10",
        },
        {
            label: "Achievements",
            value: achievements,
            change: "Бейджей получено",
            icon: <Award className="h-5 w-5" />,
            color: "text-chart-5 bg-chart-5/10",
        },
    ]

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.label} className="rounded-2xl border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-[11px] font-medium text-muted-foreground">{stat.label}</p>
                            <p className="text-[10px] text-muted-foreground/70">{stat.change}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}