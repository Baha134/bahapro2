"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, Eye, Send, Users } from "lucide-react"

interface EmployerStatsProps {
    totalTalent?: number
    viewedProfiles?: number
    savedCandidates?: number
    invitationsSent?: number
}

export function EmployerStats({
    totalTalent = 0,
    viewedProfiles = 0,
    savedCandidates = 0,
    invitationsSent = 0,
}: EmployerStatsProps) {
    const stats = [
        {
            label: "Total Talent",
            value: totalTalent.toLocaleString(),
            subtitle: "IT faculty",
            icon: <Users className="h-5 w-5" />,
            color: "text-primary bg-primary/10",
        },
        {
            label: "Viewed Profiles",
            value: viewedProfiles,
            subtitle: "This month",
            icon: <Eye className="h-5 w-5" />,
            color: "text-chart-3 bg-chart-3/10",
        },
        {
            label: "Saved Candidates",
            value: savedCandidates,
            subtitle: "Candidates",
            icon: <Bookmark className="h-5 w-5" />,
            color: "text-chart-4 bg-chart-4/10",
        },
        {
            label: "Invitations Sent",
            value: invitationsSent,
            subtitle: "Total sent",
            icon: <Send className="h-5 w-5" />,
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
                            <p className="text-[10px] text-muted-foreground/70">{stat.subtitle}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}