import { NextResponse } from 'next/server'
import { lookupParentByCode } from '@/lib/dbClient'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'رمز التلميذ العائلي مطلوب' }, { status: 400 })
    }

    const data = await lookupParentByCode(code)

    if (!data) {
      return NextResponse.json(
        {
          found: false,
          message: 'لم يتم العثور على تلميذ بهذا الرمز في قاعدة البيانات السحابية. يرجى التأكد من الرمز المسلم لك من الأستاذ.',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      found: true,
      data,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
