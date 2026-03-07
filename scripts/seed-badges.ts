import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars: Record<string, string> = {}

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
        envVars[key.trim()] = value.trim()
    }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY']

console.log('📍 URL loaded:', !!supabaseUrl)
console.log('📍 Key loaded:', !!supabaseKey)

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing env variables!')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedBadges() {
    console.log('🌱 Starting seed...')

    try {
        const { data: students } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'student')
            .limit(10)

        console.log('👥 Students:', students?.length || 0)

        if (!students || students.length === 0) {
            console.log('❌ No students')
            return
        }

        const { data: badges } = await supabase
            .from('badges')
            .select('id')
            .limit(5)

        console.log('🏅 Badges:', badges?.length || 0)

        if (!badges || badges.length === 0) {
            console.log('❌ No badges')
            return
        }

        const userBadges = students.flatMap(s =>
            badges.map((b, i) => ({
                user_id: s.id,
                badge_id: b.id,
                verified: i % 2 === 0
            }))
        )

        console.log('📊 Creating', userBadges.length, 'badges...')

        const { error } = await supabase
            .from('user_badges')
            .insert(userBadges)

        if (error) {
            console.error('❌ Error:', error.message)
            return
        }

        console.log('✅ Success!')
    } catch (error) {
        console.error('❌ Error:', error)
    }

    process.exit(0)
}

seedBadges()