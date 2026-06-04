import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { session_id, name, email, phone, quantity } = body

  const supabase = await createClient()

  // Simpan booking ke Supabase
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({ session_id, name, email, phone, quantity, status: 'pending' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Kirim email ke admin
  await resend.emails.send({
    from: 'flowszn <noreply@domainmu.com>',
    to: process.env.ADMIN_EMAIL!,
    subject: `Booking baru — ${name}`,
    html: `
      <h2>Ada booking baru masuk!</h2>
      <p><b>Nama:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Qty:</b> ${quantity}</p>
      <p><b>Session ID:</b> ${session_id}</p>
    `,
  })

  return NextResponse.json({ success: true, booking })
}