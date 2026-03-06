"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    BadgeCheck, Briefcase, ChevronLeft, ChevronRight, Download,
    Edit3, Eye, FileText, GraduationCap, Layers, Mail, MapPin,
    Palette, Phone, Printer, Share2, Sparkles, Star, Wand2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Skill { name: string; level: number }
interface Achievement {
    id: string
    verified?: boolean
    earned_at?: string
    badges?: { name?: string; description?: string }
    verifier_department?: string
}
interface Recommendation {
    id: string
    professor_name?: string
    department?: string
    course?: string
    text?: string
    verified?: boolean
    created_at?: string
}
interface Profile {
    full_name?: string
    specialty?: string
    university?: string
    university_short?: string
    year?: number
    email?: string
    location?: string
    gpa?: number
    bio?: string
    enrollment_year?: number
}

interface ResumeGeneratorProps {
    profile: Profile | null
    skills: Skill[]
    achievements: Achievement[]
    recommendations: Recommendation[]
    userEmail: string
}

const templates = [
    { id: "modern", label: "Modern", accent: "#4f46e5" },
    { id: "minimal", label: "Minimal", accent: "#0f172a" },
    { id: "creative", label: "Creative", accent: "#7c3aed" },
] as const
type TemplateId = typeof templates[number]["id"]

export function ResumeGenerator({ profile, skills, achievements, recommendations, userEmail }: ResumeGeneratorProps) {
    const [activeTemplate, setActiveTemplate] = useState<TemplateId>("modern")
    const [currentPage, setCurrentPage] = useState(1)
    const [isAiOptimizing, setIsAiOptimizing] = useState(false)
    const [aiOptimized, setAiOptimized] = useState(false)

    const topSkills = [...skills]
        .sort((a, b) => b.level - a.level)
        .slice(0, 6)

    const verifiedBadges = achievements.filter(a => a.verified)
    const template = templates.find(t => t.id === activeTemplate)!

    const fullName = profile?.full_name || userEmail.split('@')[0]
    const email = profile?.email || userEmail

    function handleAiOptimize() {
        setIsAiOptimizing(true)
        setTimeout(() => { setIsAiOptimizing(false); setAiOptimized(true) }, 2000)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Resume Generator</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Профессиональное резюме из вашего верифицированного профиля
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 rounded-xl text-xs font-semibold"
                        onClick={handleAiOptimize} disabled={isAiOptimizing}>
                        {isAiOptimizing
                            ? <><Sparkles className="h-3.5 w-3.5 animate-spin" />Оптимизируем...</>
                            : <><Wand2 className="h-3.5 w-3.5" />{aiOptimized ? "Re-optimize" : "AI Optimize"}</>
                        }
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-2 rounded-xl text-xs font-semibold">
                        <Printer className="h-3.5 w-3.5" />Print
                    </Button>
                    <Button size="sm" className="h-9 gap-2 rounded-xl text-xs font-semibold">
                        <Download className="h-3.5 w-3.5" />Download PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* Left panel */}
                <div className="flex flex-col gap-4">
                    <Card className="rounded-2xl">
                        <CardContent className="p-4">
                            <p className="mb-3 text-xs font-semibold text-foreground">Template</p>
                            <div className="flex flex-col gap-2">
                                {templates.map((t) => (
                                    <button key={t.id} onClick={() => setActiveTemplate(t.id)}
                                        className={cn("flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                                            activeTemplate === t.id
                                                ? "border-primary/40 bg-primary/5 shadow-sm"
                                                : "border-border hover:border-primary/20 hover:bg-secondary"
                                        )}>
                                        <div className="h-8 w-8 shrink-0 rounded-lg" style={{ backgroundColor: t.accent }} />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{t.label}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {t.id === "modern" ? "Clean, professional" : t.id === "minimal" ? "Simple and elegant" : "Bold and expressive"}
                                            </p>
                                        </div>
                                        {activeTemplate === t.id && <BadgeCheck className="ml-auto h-4 w-4 shrink-0 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl">
                        <CardContent className="p-4">
                            <p className="mb-3 text-xs font-semibold text-foreground">Sections</p>
                            <div className="flex flex-col gap-1.5">
                                {[
                                    { icon: GraduationCap, label: "Education", on: true },
                                    { icon: Star, label: "Skills & Radar", on: true },
                                    { icon: BadgeCheck, label: "Achievements", on: true },
                                    { icon: Briefcase, label: "Experience", on: true },
                                    { icon: FileText, label: "Recommendations", on: true },
                                    { icon: Layers, label: "Projects", on: false },
                                ].map((s) => (
                                    <label key={s.label}
                                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-secondary">
                                        <input type="checkbox" defaultChecked={s.on} className="h-3.5 w-3.5 rounded accent-primary" />
                                        <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-foreground">{s.label}</span>
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {aiOptimized && (
                        <Card className="rounded-2xl border-primary/20 bg-primary/5">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-2">
                                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <div>
                                        <p className="text-xs font-semibold text-primary">AI Optimized</p>
                                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                                            Ключевые слова подобраны под позиции Backend/Data в Казахстане.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right panel: Preview */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-semibold text-foreground">Preview</span>
                            <Badge variant="secondary" className="rounded-lg px-2 text-[10px]">{template.label}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"
                                disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </Button>
                            <span className="px-2 text-xs text-muted-foreground">Page {currentPage} of 2</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"
                                disabled={currentPage === 2} onClick={() => setCurrentPage(2)}>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
                        <div className="mx-auto aspect-[210/297] w-full max-w-[680px] bg-white p-8 sm:p-10"
                            style={{ fontFamily: "'Inter', sans-serif" }}>
                            {currentPage === 1 ? (
                                <ResumePageOne
                                    accent={template.accent}
                                    templateId={activeTemplate}
                                    fullName={fullName}
                                    email={email}
                                    profile={profile}
                                    topSkills={topSkills}
                                    recommendations={recommendations}
                                    aiOptimized={aiOptimized}
                                />
                            ) : (
                                <ResumePageTwo
                                    accent={template.accent}
                                    verifiedBadges={verifiedBadges}
                                    recommendations={recommendations}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-xl text-xs">
                            <Share2 className="h-3.5 w-3.5" />Share Link
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-xl text-xs">
                            <Edit3 className="h-3.5 w-3.5" />Edit Manually
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-xl text-xs">
                            <Palette className="h-3.5 w-3.5" />Custom Colors
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ResumePageOne({ accent, templateId, fullName, email, profile, topSkills, recommendations, aiOptimized }: {
    accent: string; templateId: TemplateId; fullName: string; email: string
    profile: Profile | null; topSkills: Skill[]; recommendations: Recommendation[]; aiOptimized: boolean
}) {
    return (
        <div className="flex h-full flex-col text-slate-800">
            <div className="mb-5 rounded-xl px-6 py-5"
                style={{ backgroundColor: accent, borderRadius: templateId === "minimal" ? "0" : undefined }}>
                <h1 className="text-xl font-bold tracking-tight" style={{ color: "#ffffff" }}>{fullName}</h1>
                <p className="mt-0.5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {profile?.specialty ?? "Computer Science"} · {profile?.university_short ?? "University"}, Year {profile?.year ?? 1}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="flex items-center gap-1"><Mail className="h-2.5 w-2.5" />{email}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{profile?.location ?? "Astana, KZ"}</span>
                    <span className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" />+7 (7xx) xxx-xx-xx</span>
                </div>
            </div>

            <div className="mb-4">
                <h2 className="mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                    Profile Summary
                </h2>
                <p className="text-[11px] leading-relaxed text-slate-600">
                    {aiOptimized
                        ? `Results-driven ${profile?.specialty ?? "CS"} student (GPA ${profile?.gpa?.toFixed(2) ?? "N/A"}/4.0) with verified expertise in software development. Seeking opportunities to leverage strong skills in a fast-paced tech environment in Kazakhstan.`
                        : (profile?.bio ?? "Motivated computer science student with strong technical and analytical skills.")}
                </p>
            </div>

            <div className="mb-4">
                <h2 className="mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>Education</h2>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-800">{profile?.university ?? "University"}</p>
                        <p className="text-[10px] text-slate-500">{profile?.specialty ?? "Computer Science"}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-700">{profile?.enrollment_year ?? "2022"} - Present</p>
                        <p className="text-[10px] text-slate-500">GPA: {profile?.gpa?.toFixed(2) ?? "N/A"} / 4.0</p>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>Verified Skills</h2>
                {topSkills.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        {topSkills.map((s) => (
                            <div key={s.name} className="flex items-center gap-2">
                                <span className="flex-1 text-[10px] font-medium text-slate-700">{s.name}</span>
                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full" style={{ width: `${s.level}%`, backgroundColor: accent }} />
                                </div>
                                <span className="w-6 text-right text-[9px] text-slate-400">{s.level}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[10px] text-slate-400">No skills added yet</p>
                )}
            </div>

            {recommendations.length > 0 && (
                <div>
                    <h2 className="mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                        Faculty Recommendations
                    </h2>
                    {recommendations.slice(0, 2).map((r) => (
                        <div key={r.id} className="mb-2 last:mb-0">
                            <p className="text-[10px] font-semibold text-slate-700">
                                {r.professor_name}
                                <span className="font-normal text-slate-400"> — {r.department}</span>
                            </p>
                            <p className="mt-0.5 text-[10px] italic leading-relaxed text-slate-500">
                                &ldquo;{(r.text ?? "").slice(0, 140)}...&rdquo;
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="text-[8px] text-slate-300">Generated by Baha Pro Career Platform</span>
                <span className="text-[8px] text-slate-300">bahapro.kz/profile</span>
            </div>
        </div>
    )
}

function ResumePageTwo({ accent, verifiedBadges, recommendations }: {
    accent: string; verifiedBadges: Achievement[]; recommendations: Recommendation[]
}) {
    return (
        <div className="flex h-full flex-col text-slate-800">
            {verifiedBadges.length > 0 && (
                <div className="mb-5">
                    <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                        Verified Achievements
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        {verifiedBadges.map((a) => (
                            <div key={a.id} className="flex items-start gap-2 rounded-lg border border-slate-100 p-2">
                                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded"
                                    style={{ backgroundColor: `${accent}15` }}>
                                    <BadgeCheck className="h-3 w-3" style={{ color: accent }} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-700">{a.badges?.name ?? "Achievement"}</p>
                                    <p className="text-[9px] text-slate-400">
                                        {a.earned_at ? new Date(a.earned_at).toLocaleDateString("ru-RU") : ""} · {a.verifier_department ?? ""}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recommendations.length > 0 && (
                <div className="mb-5">
                    <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                        Full Recommendations
                    </h2>
                    {recommendations.map((r) => (
                        <div key={r.id} className="mb-3 rounded-lg border border-slate-100 p-3 last:mb-0">
                            <div className="mb-1 flex items-center gap-1.5">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold"
                                    style={{ backgroundColor: `${accent}20`, color: accent }}>
                                    {(r.professor_name ?? "?").split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                    <span className="text-[10px] font-semibold text-slate-700">{r.professor_name}</span>
                                    <span className="text-[9px] text-slate-400"> · {r.department}</span>
                                </div>
                                {r.verified && <BadgeCheck className="ml-auto h-3 w-3" style={{ color: accent }} />}
                            </div>
                            <p className="text-[10px] leading-relaxed text-slate-600">{r.text}</p>
                            <p className="mt-1 text-[9px] text-slate-400">
                                {r.course} · {r.created_at ? new Date(r.created_at).toLocaleDateString("ru-RU") : ""}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="text-[8px] text-slate-300">Generated by Baha Pro Career Platform</span>
                <span className="text-[8px] text-slate-300">Page 2 of 2</span>
            </div>
        </div>
    )
}