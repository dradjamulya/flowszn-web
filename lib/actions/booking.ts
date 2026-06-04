"use server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitBooking({
  name, email, whatsapp, booking_option, mat_reservation, session_id, payment_proof,
}: {
  name: string;
  email: string;
  whatsapp: string;
  booking_option: "personal" | "bestie";
  mat_reservation: boolean;
  session_id: string;
  payment_proof: File;
}) {

  console.log("RESEND KEY:", process.env.RESEND_API_KEY);

  const supabase = await createClient();

  // 1. Upload bukti pembayaran
  const fileExt = payment_proof.name.split(".").pop();
  const fileName = `${session_id}_${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from("payment-proofs")
    .upload(fileName, payment_proof);

  if (uploadError) return { success: false, error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from("payment-proofs")
    .getPublicUrl(fileName);

  // 2. Insert booking ke Supabase, ambil id-nya
  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      session_id,
      name,
      email,
      whatsapp,
      booking_option,
      mat_reservation,
      payment_proof_url: publicUrl,
      status: "pending",
    })
    .select()
    .single();

  if (insertError) return { success: false, error: insertError.message };

  // 3. Insert ke tabel payments
  const { error: paymentError } = await supabase.from("payments").insert({
    booking_id: booking.id,
    proof_url: fileName, // simpan fileName bukan publicUrl, karena dashboard pakai createSignedUrl
    status: "pending_verification",
  });

  if (paymentError) return { success: false, error: paymentError.message };

  // 4. Kirim email notifikasi ke admin
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "raadjaa26@gmail.com",
    subject: `📋 Booking Baru — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2 style="color: #1E1E1A;">Ada booking baru masuk!</h2>
        <table style="width:100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #777;">Nama</td><td style="font-weight:600;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Email</td><td>${email}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">WhatsApp</td><td>${whatsapp}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Opsi</td><td>${booking_option === "bestie" ? "Bestie Deals (2 Pax)" : "Personal (1 Pax)"}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Mat Reservation</td><td>${mat_reservation ? "Ya" : "Tidak"}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Session ID</td><td style="font-size:12px; color:#999;">${session_id}</td></tr>
        </table>
        <a href="${publicUrl}" style="display:inline-block; margin-top:16px; padding: 10px 20px; background:#1E1E1A; color:white; border-radius:8px; text-decoration:none; font-size:13px;">
          Lihat Bukti Pembayaran
        </a>
      </div>
    `,
  });

  return { success: true };
}