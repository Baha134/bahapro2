import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Определяем интерфейс для студента
interface StudentProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    specialty: string | null;
    gpa: number | null;
    current_level: number | null;
    university_short: string | null;
}

export default async function TeacherStudentsPage() {
    // ИСПРАВЛЕНО: Добавлен await перед createClient()
    const supabase = await createClient();

    // Запрос к таблице profiles
    const { data: students, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, specialty, gpa, current_level, university_short')
        .eq('role', 'student')
        .order('full_name');

    if (error) {
        return (
            <div className="p-8 text-red-500 border border-red-200 rounded-lg bg-red-50">
                <h2 className="font-bold">Ошибка базы данных:</h2>
                <p>{error.message}</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">База студентов</h1>
                    <p className="text-muted-foreground text-sm">Управление и мониторинг успеваемости учащихся</p>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                    Всего: {students?.length || 0}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students?.map((student: StudentProfile) => (
                    <Card key={student.id} className="group overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all border-muted shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-4 pb-3">
                            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                <AvatarImage src={student.avatar_url || ''} alt={student.full_name || 'Студент'} />
                                <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                                    {student.full_name?.charAt(0) || 'S'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <CardTitle className="text-lg font-bold truncate">
                                    {student.full_name || 'Неизвестный студент'}
                                </CardTitle>
                                <span className="text-xs font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-full w-fit">
                                    {student.university_short || 'ВУЗ'}
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground min-h-[20px]">
                                    {student.specialty || 'Специальность не указана'}
                                </p>

                                <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-xl border border-muted/50">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">GPA</span>
                                        <span className="text-base font-black text-foreground">
                                            {student.gpa ? student.gpa.toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center border-l border-muted">
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Level</span>
                                        <span className="text-base font-black text-foreground">
                                            {student.current_level || 1}
                                        </span>
                                    </div>
                                </div>

                                {/* Путь к детальной странице студента */}
                                <Link
                                    href={`/dashboard/teacher/students/${student.id}`}
                                    className="flex items-center justify-center w-full py-2.5 px-4 rounded-lg bg-foreground text-background hover:bg-foreground/90 text-sm font-semibold transition-all group-hover:scale-[1.02]"
                                >
                                    Открыть личное дело
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Состояние, если студентов нет */}
                {students?.length === 0 && (
                    <div className="col-span-full py-32 text-center border-2 border-dashed border-muted rounded-2xl bg-muted/10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                            <span className="text-xl">🎓</span>
                        </div>
                        <h3 className="text-lg font-semibold">Студенты не найдены</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            В базе данных пока нет пользователей с ролью "student".
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}