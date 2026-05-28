'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitBooking(formData: {
  name: string
  email: string
  whatsapp: string
  booking_option: 'personal' | 'bestie'
  mat_reservation: boolean
  session_id: string
  payment_proof: File
}) {
  const supabase = await createClient()

  // Dummy user_id — nanti diganti auth.uid() setelah auth selesai
  const DUMMY_USER_ID = '00000000-0000-0000-0000-000000000000'

  // 1. Insert booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: DUMMY_USER_ID,
      session_id: formData.session_id,
      status: 'pending_payment',
      booking_option: formData.booking_option,
      mat_reservation: formData.mat_reservation,
    })
    .select()
    .single()

  if (bookingError) {
    return { success: false, error: bookingError.message }
  }

  // 2. Upload payment proof ke Supabase Storage
  const fileExt = formData.payment_proof.name.split('.').pop()
  const fileName = `${booking.id}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('payment-proofs')
    .upload(fileName, formData.payment_proof)

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  // 3. Insert payment record
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      booking_id: booking.id,
      proof_url: fileName,
      status: 'pending_verification',
    })

  if (paymentError) {
    return { success: false, error: paymentError.message }
  }

  return { success: true, booking_id: booking.id }
}