import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: students } = await supabase
            .from('profiles').select('*').eq('role', 'student')

        const { data: allSkills } = await supabase
            .from('skills').select('*')

        const { data: allBadges } = await supabase
            .from('user_badges').select('*, badges(*)')

        const { data: recs } = await supabase
            .from('recommendations').select('*')

        const avgGpa = students && students.length > 0
            ? (students.reduce((sum, s) => sum + (s.gpa ?? 0), 0) / students.length).toFixed(2)
            : '0.00'

        const deansListCount = students?.filter(s => s.deans_list).length ?? 0
        const internshipReady = students?.filter(s => s.available_for_internship).length ?? 0

        const skillCount: Record<string, number> = {}
        allSkills?.forEach(s => { skillCount[s.name] = (skillCount[s.name] ?? 0) + 1 })
        const topSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

        return NextResponse.json({
            students,
            allSkills,
            allBadges,
            recs,
            avgGpa,
            deansListCount,
            internshipReady,
            topSkills
        })
    } catch (error) {
        console.error('Ошибка API:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
