import { NextResponse } from 'next/server'
import { getCMS } from '@/lib/cms'

export async function POST(request: Request) {
  const form = await request.formData()
  const name = String(form.get('name') || '').trim()
  const email = String(form.get('email') || '').trim()
  const message = String(form.get('message') || '').trim()
  if (!name || !email || !message) return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 })
  const payload = await getCMS()
  if (!payload) return NextResponse.json({ error: 'The enquiry service is not configured yet.' }, { status: 503 })
  try {
    await payload.create({ collection: 'inquiries', data: { name, email, message, phone: String(form.get('phone') || ''), service: String(form.get('service') || ''), source: 'website' } })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Could not save enquiry.' }, { status: 500 }) }
}
