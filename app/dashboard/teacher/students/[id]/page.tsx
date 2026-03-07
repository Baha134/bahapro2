import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress'; // Добавь этот компонент через shadcn
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Добавь через shadcn

// Импортируем типы, если они есть, или определяем на месте
interface Skill {
    id: string;
    name: string;
    level: number;
    is_verified: boolean;
    category: 'hard' | 'soft';
}

interface Project {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in_progress';
}

interface UserBadge {
    id: string;
    verified: boolean;
    earned_at: string;
    badges: {
        name: string;
        description: string;
        icon: string;
        rarity: 'common' | 'rare' | 'epic';
    };
}

// Заглушка для Радара навыков (пока нет библиотеки диаграмм)
function SkillsRadarChart({ skills }: { skills: Skill[] }) {
    const hardSkills = skills.filter(s => s.category === 'hard');
    return (
        <div className="flex flex-col gap-2 border p-4 rounded-xl bg-muted/20">
            <div className="text-sm font-semibold text-center mb-2">Распределение Hard Skills (Топ)</div>
            {hardSkills.slice(0, 5).map(skill => (
                <div key={skill.id} className="flex items-center gap-3 text-sm">
                    <span className="font-mono w-6 text-right">{skill.level}</span>
                    <Progress value={skill.level} className="h-1.5 flex-1" />
                    <span className="w-24 truncate">{skill.name}</span>
                </div>
            ))}
            <p className="text-xs text-muted-foreground text-center mt-2">Интерактивный радар будет здесь.</p>
        </div>
    );
}

// Компонент для отображения бейджа
function BadgeCard({ userBadge }: { userBadge: UserBadge }) {
    const rarityColors = {
        common: 'border-muted bg-muted/50 text-muted-foreground',
        rare: 'border-blue-200 bg-blue-50 text-blue-700',
        epic: 'border-purple-300 bg-purple-50 text-purple-700',
    };

    return (
        <div className={`flex items-center gap-3 p-3 border rounded-xl shadow-sm ${rarityColors[userBadge.badges.rarity]}`}>
            <div className="text-3xl">{userBadge.badges.icon || '🏆'}</div>
            <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                    {userBadge.badges.name}
                    {!userBadge.verified && <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">Pending</Badge>}
                </div>
                <p className="text-xs opacity-80">{userBadge.badges.description}</p>
                <p className="text-[10px] opacity-60 mt-1">Получен: {new Date(userBadge.earned_at).toLocaleDateString()}</p>
            </div>
        </div>
    );
}

export default async function StudentDossierPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Загружаем ВСЕ данные (JOIN)
    const { data: student, error } = await supabase
        .from('profiles')
        .select(`
      *,
      skills (*),
      projects (*),
      user_badges (*, badges (*)),
      activity_log (*)
    `)
        .eq('id', id)
        .single();

    if (error || !student) notFound();

    // Логика расчета уровня (если нет в базе)
    const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;
    const currentLevel = student.current_level || calculateLevel(student.xp || 0);
    const xpForNextLevel = (currentLevel ** 2) * 100;
    const xpProgress = ((student.xp || 0) % 100); // Примерный прогресс внутри уровня

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-muted/10 min-h-screen">

            {/* 1. Геймифицированная Шапка */}
            <div className="relative overflow-hidden bg-card p-8 rounded-3xl border shadow-lg">
                {/* Декоративный фон */}
                <div className="absolute -top-10 -right-10 text-[200px] opacity-5 rotate-12">🎓</div>

                <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <Avatar className="h-32 w-32 border-8 border-background shadow-2xl">
                        <AvatarImage src={student.avatar_url || ''} />
                        <AvatarFallback className="text-5xl font-black bg-primary/5 text-primary">
                            {student.full_name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-5xl font-black tracking-tighter text-foreground">{student.full_name}</h1>
                            <Badge className="bg-blue-600 text-base px-3 py-1 rounded-full">GPA: {student.gpa}</Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground font-medium">
                            <span>{student.specialty}</span> •
                            <span>{student.university_short}</span> •
                            <span>{student.year} курс</span>
                        </div>

                        {/* Панель XP и Уровня */}
                        <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-xl max-w-xl border">
                            <div className="flex flex-col items-center justify-center h-16 w-16 bg-primary text-primary-foreground rounded-full font-black shadow-lg">
                                <div className="text-[10px] uppercase opacity-80">Lvl</div>
                                <div className="text-3xl leading-none">{currentLevel}</div>
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span>Опыт (XP)</span>
                                    <span>{student.xp || 0} / {xpForNextLevel} XP</span>
                                </div>
                                <Progress value={xpProgress} className="h-3 bg-primary/10" />
                                <p className="text-[11px] text-muted-foreground italic text-center">Осталось {(xpForNextLevel - (student.xp || 0))} XP до уровня {currentLevel + 1}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Левая колонка (Навыки и Визуализация) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-sm border-muted overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b">
                            <CardTitle>Портфель навыков</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <SkillsRadarChart skills={student.skills || []} />

                            <div className="space-y-3">
                                <div className="text-sm font-semibold">Все навыки</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {student.skills?.map((skill: Skill) => (
                                        <Badge
                                            key={skill.id}
                                            variant={skill.is_verified ? "default" : "outline"}
                                            className={`text-[11px] font-medium ${skill.is_verified ? 'bg-green-600' : ''}`}
                                        >
                                            {skill.name} ({skill.level})
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Правая колонка (Проекты, Бейджи, Активность) */}
                <div className="lg:col-span-3">
                    <Tabs defaultValue="projects" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-card border shadow-inner h-14 p-1.5">
                            <TabsTrigger value="projects" className="rounded-lg text-sm font-semibold">🚀 Проекты ({student.projects?.length})</TabsTrigger>
                            <TabsTrigger value="badges" className="rounded-lg text-sm font-semibold">🏆 Бейджи ({student.user_badges?.length})</TabsTrigger>
                            <TabsTrigger value="activity" className="rounded-lg text-sm font-semibold">⚡ Активность</TabsTrigger>
                        </TabsList>

                        <Separator className="my-6 bg-muted/50" />

                        {/* Контент: Проекты */}
                        <TabsContent value="projects" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {student.projects?.map((project: Project) => (
                                    <Card key={project.id} className="group hover:border-primary transition-all rounded-xl shadow-sm">
                                        <CardHeader>
                                            <div className="flex justify-between items-center mb-1">
                                                <CardTitle className="text-lg font-bold group-hover:text-primary">{project.title}</CardTitle>
                                                <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="text-[10px]">
                                                    {project.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{project.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Контент: Бейджи (NEW) */}
                        <TabsContent value="badges" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {student.user_badges?.map((ub: any) => (
                                    <BadgeCard key={ub.id} userBadge={ub} />
                                ))}
                                {student.user_badges?.length === 0 && (
                                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl bg-white">
                                        <p className="text-muted-foreground">У студента пока нет бейджей</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Контент: Активность (NEW) */}
                        <TabsContent value="activity">
                            <Card className="rounded-xl shadow-sm border-muted">
                                <CardHeader>
                                    <CardTitle>Лента событий</CardTitle>
                                    <CardDescription>Последние действия и достижения</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {student.activity_log?.slice(0, 5).map((log: any, index: number) => (
                                        <div key={log.id} className="flex gap-4 items-start relative">
                                            {index !== (student.activity_log.length - 1) && (
                                                <div className="absolute left-[13px] top-6 w-0.5 h-full bg-border" />
                                            )}
                                            <div className="h-7 w-7 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-xs shadow">
                                                {log.type === 'badge' ? '🏆' : '📝'}
                                            </div>
                                            <div className="flex-1 space-y-0.5 pt-0.5">
                                                <p className="text-sm font-semibold">{log.title}</p>
                                                <p className="text-xs text-muted-foreground">{log.description}</p>
                                                <p className="text-[10px] text-muted-foreground/60">{new Date(log.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}