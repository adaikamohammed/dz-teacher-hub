import { NextResponse } from 'next/server'
import { saveTeacherToCloud, getTeacherFromCloud } from '@/lib/dbClient'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    if (!payload.teacherId || !payload.profile) {
      return NextResponse.json({ error: 'Missing teacherId or profile' }, { status: 400 })
    }

    const result = await saveTeacherToCloud(payload)
    return NextResponse.json({
      message: 'تمت المزامنة السحابية بنجاح في قاعدة بيانات Vercel',
      ...result,
    })
  } catch (error: any) {
    console.error('Cloud sync error:', error)
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')
    if (!teacherId) {
      return NextResponse.json({ error: 'teacherId is required' }, { status: 400 })
    }

    const data = await getTeacherFromCloud(teacherId)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
