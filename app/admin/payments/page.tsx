"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const supabase = createClient();

  const fetchPayments = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("payments data:", data);
    console.log("payments error:", error);

    if (!data) {
      setLoading(false);
      return;
    }

    const bookingIds = data.map((p) => p.booking_id).filter(Boolean);
    const { data: bookings, error: bookingError } = await supabase
      .from("bookings")
      .select("*, sessions(id, date_time, event_id, events(title, location))")
      .in("id", bookingIds);

    const userIds = [
      ...new Set(bookings?.map((b) => b.user_id).filter(Boolean)),
    ];
    console.log("userIds:", userIds); // ← tambah ini

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .in("id", userIds as string[]);

    const merged = data.map((p) => {
      const booking = bookings?.find((b) => b.id === p.booking_id) ?? null;
      const profile =
        profiles?.find((pr) => pr.id === booking?.user_id) ?? null;
      return { ...p, bookings: booking, profile };
    });

    setPayments(merged);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (payment: any, approve: boolean) => {
    setProcessing(payment.id);
    const newStatus = approve ? "verified" : "rejected";
    const bookingStatus = approve ? "verified" : "cancelled";

    await supabase
      .from("payments")
      .update({
        status: newStatus,
        verified_by: (await supabase.auth.getUser()).data.user?.id,
        verified_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    await supabase
      .from("bookings")
      .update({ status: bookingStatus })
      .eq("id", payment.bookings?.id);

    if (approve) {
      const sessionId = payment.bookings?.sessions?.id;
      const pax = payment.bookings?.booking_option === "bestie" ? 2 : 1;

      console.log("booking_option:", payment.bookings?.booking_option);
      console.log("pax:", pax);
      console.log("sessionId:", sessionId);

      if (sessionId) {
        const { data: sessionData } = await supabase
          .from("sessions")
          .select("booked_slots, event_id")
          .eq("id", sessionId)
          .single();

        const current = sessionData?.booked_slots ?? 0;

        // Update booked_slots — hanya sekali
        await supabase
          .from("sessions")
          .update({ booked_slots: current + pax })
          .eq("id", sessionId);

        // Insert stamp
        const userId = payment.bookings?.user_id;
        const eventId = sessionData?.event_id;

        if (
          userId &&
          eventId &&
          userId !== "00000000-0000-0000-0000-000000000000"
        ) {
          await supabase.from("stamps").insert({
            user_id: userId,
            event_id: eventId,
            booking_id: payment.bookings?.id,
          });
        }
      }
    }

    setProcessing(null);
    await fetchPayments();
  };

  const getProofUrl = async (fileName: string) => {
    const { data } = await supabase.storage
      .from("payment-proofs")
      .createSignedUrl(fileName, 60);
    if (data?.signedUrl) setPreviewUrl(data.signedUrl);
  };

  const statusColor = (status: string) => {
    if (status === "verified") return { bg: "#DCF0E0", color: "#2D7A3A" };
    if (status === "rejected") return { bg: "#FFE0E0", color: "#A03030" };
    return { bg: "#FFF3DC", color: "#A06010" };
  };

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "28px",
          color: "var(--text-primary)",
          marginBottom: "8px",
        }}
      >
        Verifikasi Payment
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          marginBottom: "32px",
        }}
      >
        {payments.filter((p) => p.status === "pending_verification").length}{" "}
        payment menunggu verifikasi
      </p>

      {loading ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            padding: "40px",
          }}
        >
          Loading...
        </p>
      ) : payments.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            padding: "40px",
          }}
        >
          Belum ada payment.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {payments.map((payment) => {
            const sc = statusColor(payment.status);
            const event = payment.bookings?.sessions?.events;
            return (
              <div
                key={payment.id}
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                    }}
                  >
                    {event?.title ?? "Event"}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginTop: "2px",
                    }}
                  >
                    {event?.location} ·{" "}
                    {payment.bookings?.sessions?.date_time
                      ? new Date(
                          payment.bookings.sessions.date_time,
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}{" "}
                    · {payment.bookings?.booking_option ?? "—"} ·{" "}
                    {payment.bookings?.mat_reservation ? "Mat ✓" : "No mat"}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginTop: "4px",
                    }}
                  >
                    👤{" "}
                    {payment.profile?.full_name ??
                      payment.bookings?.name ??
                      "—"}
                  </p>
                  <p
                    style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                  >
                    📱{" "}
                    {payment.profile?.phone ??
                      payment.bookings?.whatsapp ??
                      "—"}
                  </p>
                  <p
                    style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                  >
                    ✉️ {payment.bookings?.email ?? "—"}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      marginTop: "4px",
                    }}
                  >
                    {new Date(payment.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "500",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      background: sc.bg,
                      color: sc.color,
                    }}
                  >
                    {payment.status}
                  </span>

                  {payment.proof_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => getProofUrl(payment.proof_url)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Eye size={13} /> Lihat Bukti
                    </Button>
                  )}

                  {payment.status === "pending_verification" && (
                    <>
                      <Button
                        size="sm"
                        disabled={processing === payment.id}
                        onClick={() => handleVerify(payment, true)}
                        style={{
                          background: "#4A7A5A",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <CheckCircle size={13} /> Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={processing === payment.id}
                        onClick={() => handleVerify(payment, false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <XCircle size={13} /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent style={{ maxWidth: "500px" }}>
          <DialogHeader>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="bukti transfer"
              style={{
                width: "100%",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
