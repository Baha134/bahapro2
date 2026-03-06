"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BadgeCheck, MessageSquareText, Quote } from "lucide-react"

interface Recommendation {
    id: string
    professor_name?: string
    department?: string
    course?: string
    text?: string
    verified?: boolean
    created_at?: string
}

interface RecommendationsFeedProps {
    recommendations: Recommendation[]
}

export function RecommendationsFeed({ recommendations }: RecommendationsFeedProps) {
    if (recommendations.length === 0) {
        return (
            <Card className="rounded-2xl border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <MessageSquareText className="h-4 w-4 text-primary" />
                        Professor Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground text-center py-10">
                        Нет рекомендаций
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="rounded-2xl border-border">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-semibold text-foreground">
                    <span className="flex items-center gap-2">
                        <MessageSquareText className="h-4 w-4 text-primary" />
                        Professor Recommendations
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                        {recommendations.length} reviews
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pb-5">
                {recommendations.map((rec) => {
                    const initials = (rec.professor_name ?? "??")
                        .split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()

                    return (
                        <div key={rec.id} className="rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50">
                            <div className="mb-3 flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[13px] font-semibold text-foreground">
                                            {rec.professor_name ?? "Professor"}
                                        </p>
                                        {rec.verified && (
                                            <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        {rec.department ?? ""}
                                    </p>
                                </div>
                                {rec.created_at && (
                                    <span className="shrink-0 text-[10px] text-muted-foreground">
                                        {new Date(rec.created_at).toLocaleDateString("ru-RU")}
                                    </span>
                                )}
                            </div>

                            {rec.text && (
                                <div className="relative pl-4">
                                    <Quote className="absolute left-0 top-0 h-3 w-3 text-primary/40" />
                                    <p className="text-[13px] leading-relaxed text-foreground/80">
                                        {rec.text}
                                    </p>
                                </div>
                            )}

                            <div className="mt-3 flex items-center gap-2">
                                {rec.course && (
                                    <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                        {rec.course}
                                    </span>
                                )}
                                {rec.verified && (
                                    <span className="flex items-center gap-1 text-[10px] text-chart-3">
                                        <BadgeCheck className="h-3 w-3" />
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}