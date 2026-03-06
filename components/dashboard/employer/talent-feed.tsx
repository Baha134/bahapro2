"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
    BadgeCheck, BookOpen, Bookmark, BookmarkCheck, ChevronDown,
    Clock, ExternalLink, Filter, GraduationCap, MapPin,
    Search, Sparkles, Star, Trophy, X,
} from "lucide-react"

interface StudentSkill {
    name: string
    level: "expert" | "advanced" | "intermediate"
}

interface TalentStudent {
    id: string
    full_name?: string
    email?: string
    university?: string
    faculty?: string
    location?: string
    bio?: string
    gpa?: number
    year?: number
    skills?: StudentSkill[] | { name: string; level: number }[]
    match_score?: number
    percentile?: number
    recommendations_count?: number
    badges_count?: number
    available_for_internship?: boolean
    avatar_initials?: string
}

interface TalentFeedProps {
    students: TalentStudent[]
}

type FilterKey = "top5" | "internship" | "highGpa" | "recommended"

const filterConfig: { key: FilterKey; label: string; icon: React.ReactNode }[] = [
    { key: "top5", label: "Top 5%", icon: <Trophy className="h-3.5 w-3.5" /> },
    { key: "internship", label: "Available for internship", icon: <Clock className="h-3.5 w-3.5" /> },
    { key: "highGpa", label: "GPA 3.5+", icon: <Star className="h-3.5 w-3.5" /> },
    { key: "recommended", label: "3+ recommendations", icon: <BadgeCheck className="h-3.5 w-3.5" /> },
]

const skillLevelColor: Record<string, string> = {
    expert: "bg-primary/15 text-primary border-primary/25",
    advanced: "bg-chart-3/15 text-chart-3 border-chart-3/25",
    intermediate: "bg-chart-4/15 text-chart-4 border-chart-4/25",
}

function getInitials(name?: string, email?: string): string {
    if (name) return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    if (email) return email[0].toUpperCase()
    return "??"
}

function getSkillLevel(skill: StudentSkill | { name: string; level: number }): string {
    if ("level" in skill && typeof skill.level === "number") {
        if (skill.level >= 80) return "expert"
        if (skill.level >= 50) return "advanced"
        return "intermediate"
    }
    return (skill as StudentSkill).level ?? "intermediate"
}

function TalentCard({
    student, saved, onToggleSave,
}: {
    student: TalentStudent
    saved: boolean
    onToggleSave: () => void
}) {
    const [expanded, setExpanded] = useState(false)
    const skills = student.skills ?? []
    const matchScore = student.match_score ?? 0
    const percentile = student.percentile ?? 50
    const initials = student.avatar_initials ?? getInitials(student.full_name, student.email)

    return (
        <Card className="group relative overflow-hidden rounded-2xl border-border transition-all duration-200 hover:border-primary/30 hover:shadow-md">
            {/* Match score ribbon */}
            <div className="absolute right-4 top-4 z-10">
                <div className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold",
                    matchScore >= 90 ? "bg-primary/15 text-primary"
                        : matchScore >= 80 ? "bg-chart-3/15 text-chart-3"
                            : "bg-chart-4/15 text-chart-4"
                )}>
                    <Sparkles className="h-3 w-3" />
                    {matchScore}% match
                </div>
            </div>

            <CardContent className="p-5">
                {/* Header */}
                <div className="mb-4 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-bold text-foreground">
                                {student.full_name ?? student.email ?? "Student"}
                            </h3>
                            {percentile <= 5 && <Trophy className="h-3.5 w-3.5 shrink-0 text-chart-4" />}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                            {student.university && (
                                <span className="flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3" />
                                    {student.university}{student.year ? `, ${student.year}-year` : ""}
                                </span>
                            )}
                            {student.faculty && (
                                <span className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {student.faculty}
                                </span>
                            )}
                            {student.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {student.location}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio */}
                {student.bio && (
                    <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                        {student.bio}
                    </p>
                )}

                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                    {percentile <= 5 && (
                        <Badge variant="secondary" className="rounded-lg border border-chart-4/25 bg-chart-4/10 px-2 py-0.5 text-[10px] font-semibold text-chart-4">
                            Top 5%
                        </Badge>
                    )}
                    {student.available_for_internship && (
                        <Badge variant="secondary" className="rounded-lg border border-chart-3/25 bg-chart-3/10 px-2 py-0.5 text-[10px] font-semibold text-chart-3">
                            Internship Ready
                        </Badge>
                    )}
                    {(student.gpa ?? 0) >= 3.5 && (
                        <Badge variant="secondary" className="rounded-lg border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            GPA {student.gpa?.toFixed(2)}
                        </Badge>
                    )}
                </div>

                {/* Stats row */}
                <div className="mb-3 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground">{student.gpa?.toFixed(2) ?? "—"}</span>
                        <span className="text-muted-foreground">GPA</span>
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground">Top {percentile}%</span>
                        <span className="text-muted-foreground">rank</span>
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div className="flex items-center gap-1.5">
                        <BadgeCheck className="h-3 w-3 text-chart-3" />
                        <span className="font-bold text-foreground">{student.recommendations_count ?? 0}</span>
                        <span className="text-muted-foreground">recs</span>
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div className="flex items-center gap-1.5">
                        <Trophy className="h-3 w-3 text-chart-4" />
                        <span className="font-bold text-foreground">{student.badges_count ?? 0}</span>
                        <span className="text-muted-foreground">badges</span>
                    </div>
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                            {(expanded ? skills : skills.slice(0, 3)).map((skill, i) => (
                                <span key={i} className={cn(
                                    "inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-medium",
                                    skillLevelColor[getSkillLevel(skill)] ?? skillLevelColor.intermediate
                                )}>
                                    {skill.name}
                                </span>
                            ))}
                            {!expanded && skills.length > 3 && (
                                <button onClick={() => setExpanded(true)}
                                    className="inline-flex items-center gap-0.5 rounded-lg border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                                    +{skills.length - 3} more <ChevronDown className="h-2.5 w-2.5" />
                                </button>
                            )}
                            {expanded && skills.length > 3 && (
                                <button onClick={() => setExpanded(false)}
                                    className="inline-flex items-center gap-0.5 rounded-lg border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                                    Show less
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button size="sm" className="h-8 flex-1 gap-1.5 rounded-xl text-xs font-semibold">
                        <ExternalLink className="h-3 w-3" />
                        View Profile
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 flex-1 gap-1.5 rounded-xl text-xs font-semibold">
                        Invite to Apply
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 rounded-xl" onClick={onToggleSave}>
                        {saved
                            ? <BookmarkCheck className="h-4 w-4 text-primary" />
                            : <Bookmark className="h-4 w-4 text-muted-foreground" />
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export function TalentFeed({ students }: TalentFeedProps) {
    const [activeFilters, setActiveFilters] = useState<FilterKey[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [savedStudents, setSavedStudents] = useState<string[]>([])
    const [sortBy, setSortBy] = useState<"match" | "gpa" | "percentile">("match")

    const toggleFilter = (key: FilterKey) =>
        setActiveFilters(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key])

    const toggleSave = (id: string) =>
        setSavedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

    const filtered = students
        .filter(s => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                const nameMatch = (s.full_name ?? "").toLowerCase().includes(q)
                const skillMatch = (s.skills ?? []).some(sk => sk.name.toLowerCase().includes(q))
                if (!nameMatch && !skillMatch) return false
            }
            if (activeFilters.includes("top5") && (s.percentile ?? 100) > 5) return false
            if (activeFilters.includes("internship") && !s.available_for_internship) return false
            if (activeFilters.includes("highGpa") && (s.gpa ?? 0) < 3.5) return false
            if (activeFilters.includes("recommended") && (s.recommendations_count ?? 0) < 3) return false
            return true
        })
        .sort((a, b) => {
            if (sortBy === "match") return (b.match_score ?? 0) - (a.match_score ?? 0)
            if (sortBy === "gpa") return (b.gpa ?? 0) - (a.gpa ?? 0)
            return (a.percentile ?? 100) - (b.percentile ?? 100)
        })

    return (
        <div>
            {/* Search + Sort */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search by name or skill..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="h-9 rounded-xl bg-secondary pl-9 text-sm" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Sort by:</span>
                    {([
                        { key: "match", label: "AI Match" },
                        { key: "gpa", label: "GPA" },
                        { key: "percentile", label: "Ranking" },
                    ] as const).map(opt => (
                        <button key={opt.key} onClick={() => setSortBy(opt.key)}
                            className={cn("rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                                sortBy === opt.key
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                {filterConfig.map(f => (
                    <button key={f.key} onClick={() => toggleFilter(f.key)}
                        className={cn("inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all",
                            activeFilters.includes(f.key)
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground"
                        )}>
                        {f.icon}{f.label}
                        {activeFilters.includes(f.key) && <X className="ml-0.5 h-3 w-3 opacity-60" />}
                    </button>
                ))}
                {activeFilters.length > 0 && (
                    <button onClick={() => setActiveFilters([])}
                        className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
                        Clear all
                    </button>
                )}
            </div>

            {/* Count */}
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{filtered.length}</span> talent(s) found
                </p>
                {savedStudents.length > 0 && (
                    <p className="flex items-center gap-1.5 text-xs text-primary">
                        <BookmarkCheck className="h-3.5 w-3.5" />{savedStudents.length} saved
                    </p>
                )}
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map(student => (
                        <TalentCard key={student.id} student={student}
                            saved={savedStudents.includes(student.id)}
                            onToggleSave={() => toggleSave(student.id)} />
                    ))}
                </div>
            ) : (
                <Card className="rounded-2xl border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">No talent matches your filters</p>
                        <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or search</p>
                        <Button variant="outline" size="sm" className="mt-4 rounded-xl"
                            onClick={() => { setActiveFilters([]); setSearchQuery("") }}>
                            Reset Filters
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}