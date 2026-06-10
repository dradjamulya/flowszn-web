"use client";
import { use, useState, useEffect } from "react";
import { MapPin, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/layout/BackButton";
import { submitBooking } from "@/lib/actions/booking";
import { createClient } from "@/lib/supabase/client";

export default function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useProfile, setUseProfile] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [bookingOption, setBookingOption] = useState<"personal" | "bestie">(
    "personal",
  );
  const [matReservation, setMatReservation] = useState<"no" | "yes">("no");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const supabase = createClient();
      const { data: eventData } = await supabase
        .from("events")
        .select("*, sessions(*)")
        .eq("id", id)
        .single();
      if (eventData) {
        setEvent(eventData);
        setSession(eventData.sessions?.[0] ?? null);
      }
      setLoadingData(false);
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Kalau belum login, redirect ke login dengan redirect param
      if (!user) {
        router.push(`/login?redirect=/book/${id}`);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, phone, role")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name ?? "",
          email: user.email ?? "",
          phone: profileData.phone ?? "",
          role: profileData.role,
        });
        setUserRole(profileData.role);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (useProfile && profile) {
      setForm({
        name: profile.full_name ?? "",
        email: profile.email ?? "",
        whatsapp: profile.phone ?? "",
      });
    } else if (!useProfile) {
      setForm({ name: "", email: "", whatsapp: "" });
    }
  }, [useProfile, profile]);

  const handleBooking = async () => {
    if (!form.name || !form.email || !form.whatsapp) {
      setError("Mohon isi semua field terlebih dahulu.");
      return;
    }
    if (!paymentFile) {
      setError("Mohon upload bukti pembayaran.");
      return;
    }
    if (!session?.id) {
      setError("Session tidak ditemukan untuk event ini.");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await submitBooking({
      name: form.name,
      email: form.email,
      whatsapp: form.whatsapp,
      booking_option: bookingOption,
      mat_reservation: matReservation === "yes",
      session_id: session.id,
      payment_proof: paymentFile,
    });
    setLoading(false);
    if (result.success) {
      router.push("/book/thanks");
    } else {
      setError(result.error || "Terjadi kesalahan, coba lagi.");
    }
  };

  const dateStr = session?.date_time
    ? new Date(session.date_time).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "TBA";

  const timeStr = session?.date_time
    ? new Date(session.date_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const CheckIcon = () => (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path
        d="M1 4L3.5 6.5L9 1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const Checkbox = ({
    checked,
    onClick,
  }: {
    checked: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      style={{
        width: "18px",
        height: "18px",
        borderRadius: "4px",
        flexShrink: 0,
        border: "1.5px solid var(--text-secondary)",
        background: checked ? "var(--text-primary)" : "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked && <CheckIcon />}
    </div>
  );

  if (loadingData) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#F0EDE5",
          padding: "80px 32px 40px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          Loading...
        </p>
      </main>
    );
  }

  if (!event) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#F0EDE5",
          padding: "80px 32px 40px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          Event tidak ditemukan.
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F0EDE5",
        padding: "80px 0 40px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 32px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            marginBottom: "24px",
          }}
        >
          <BackButton />
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "var(--text-primary)",
              textAlign: "center",
            }}
          >
            Book Sesh...
          </h1>
        </div>

        <div className="book-layout">
          {/* Left — Event Detail */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignSelf: "start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  background: "var(--text-primary)",
                  color: "var(--bg-cream)",
                  padding: "5px 14px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {dateStr}
              </div>
              <div
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  aspectRatio: "16/9",
                }}
              >
                <img
                  src={
                    event.thumbnail_url ||
                    "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80"
                  }
                  alt={event.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "#D4CFC6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  overflow: "hidden",
                }}
              >
                {event.instructor_photo_url ? (
                  <img
                    src={event.instructor_photo_url}
                    alt={event.instructor_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  (event.instructor_name?.[0] ?? "?")
                )}
              </div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                {event.instructor_name}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <MapPin size={12} color="var(--text-secondary)" />
                <span
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  {event.location}
                </span>
              </div>
              <span
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                {timeStr}
              </span>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                lineHeight: "1.6",
              }}
            >
              {event.description}
            </p>

            {event.benefits && event.benefits.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  Benefits:
                </p>
                <ul style={{ paddingLeft: "16px", margin: 0 }}>
                  {event.benefits.map((b: string, i: number) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        lineHeight: "1.7",
                      }}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price Summary */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                }}
              >
                Price Summary
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {bookingOption === "bestie"
                    ? "Bestie Deals (2 Pax)"
                    : "Personal (1 Pax)"}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-primary)",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  Rp{" "}
                  {bookingOption === "bestie"
                    ? ((session?.price ?? 0) * 2 * 0.9).toLocaleString("id-ID")
                    : (session?.price ?? 0).toLocaleString("id-ID")}
                </span>
              </div>

              {matReservation === "yes" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Mat Reservation{" "}
                    {bookingOption === "bestie" ? "(2x)" : "(1x)"}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Rp{" "}
                    {(bookingOption === "bestie"
                      ? 20000
                      : 10000
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
              )}

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                  }}
                >
                  Rp{" "}
                  {(
                    (bookingOption === "bestie"
                      ? (session?.price ?? 0) * 2 * 0.9
                      : (session?.price ?? 0)) +
                    (matReservation === "yes"
                      ? bookingOption === "bestie"
                        ? 20000
                        : 10000
                      : 0)
                  ).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Transfer Info */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                border: "1.5px solid var(--border)",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                Transfer to
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Bank
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                  }}
                >
                  BCA
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Acc. Number
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    letterSpacing: "0.05em",
                  }}
                >
                  1234567890
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Name
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                  }}
                >
                  Flowszn Indonesia
                </span>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  marginTop: "10px",
                  lineHeight: 1.6,
                  borderTop: "1px solid var(--border)",
                  paddingTop: "10px",
                }}
              >
                Transfer the exact total amount, then upload proof below.
              </p>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontStyle: "italic",
              }}
            >
              See you flowies!
            </p>
          </div>

          {/* Right — Form */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignSelf: "start",
              position: "sticky",
              top: "100px",
            }}
          >
            {userRole === "admin" ? (
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "20px",
                    fontFamily: "var(--font-playfair)",
                    color: "var(--text-primary)",
                  }}
                >
                  Kamu Admin
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  Admin tidak bisa melakukan booking. Untuk mengelola atau
                  menambah event baru, buka dashboard admin.
                </p>
                <button
                  onClick={() => router.push("/admin/events")}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "10px",
                    border: "none",
                    background: "var(--text-primary)",
                    color: "var(--bg-cream)",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontFamily: "var(--font-playfair)",
                    width: "100%",
                  }}
                >
                  + Tambah Event di Dashboard
                </button>
              </div>
            ) : (
              <>
                <h2
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "18px",
                    color: "var(--text-primary)",
                    textAlign: "center",
                    marginBottom: "2px",
                  }}
                >
                  Fill me out!
                </h2>

                <div
                  onClick={() => setUseProfile(!useProfile)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <Checkbox
                    checked={useProfile}
                    onClick={() => setUseProfile(!useProfile)}
                  />
                  <span
                    style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                  >
                    Use my profile data
                  </span>
                </div>

                {[
                  { label: "Name", key: "name", type: "text" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Whatsapp Number", key: "whatsapp", type: "tel" },
                ].map(({ label, key, type }) => (
                  <div
                    key={key}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "10px 16px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginBottom: "6px",
                      }}
                    >
                      {label}
                    </p>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      style={{
                        width: "100%",
                        border: "none",
                        borderBottom: "1px solid var(--border)",
                        outline: "none",
                        fontSize: "13px",
                        color: "var(--text-primary)",
                        padding: "4px 0",
                        background: "transparent",
                      }}
                    />
                  </div>
                ))}

                {/* Booking option */}
                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "10px 16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginBottom: "10px",
                    }}
                  >
                    Booking option
                  </p>
                  <div style={{ display: "flex", gap: "24px" }}>
                    {[
                      { val: "personal", label: "Personal", sub: "(1 Pax)" },
                      { val: "bestie", label: "Bestie Deals!", sub: "(2 Pax)" },
                    ].map((opt) => (
                      <div
                        key={opt.val}
                        onClick={() =>
                          setBookingOption(opt.val as "personal" | "bestie")
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <Checkbox
                          checked={bookingOption === opt.val}
                          onClick={() =>
                            setBookingOption(opt.val as "personal" | "bestie")
                          }
                        />
                        <span
                          style={{
                            fontSize: "13px",
                            color: "var(--text-primary)",
                          }}
                        >
                          {opt.label}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {opt.sub}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mat reservation */}
                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "10px 16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginBottom: "10px",
                    }}
                  >
                    Mat Reservation
                  </p>
                  <div style={{ display: "flex", gap: "24px" }}>
                    {[
                      { val: "no", label: "No", sub: null },
                      {
                        val: "yes",
                        label: "Yes, Please!",
                        sub: "(+Rp 10.000 / Mat)",
                      },
                    ].map((opt) => (
                      <div
                        key={opt.val}
                        onClick={() =>
                          setMatReservation(opt.val as "no" | "yes")
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <Checkbox
                          checked={matReservation === opt.val}
                          onClick={() =>
                            setMatReservation(opt.val as "no" | "yes")
                          }
                        />
                        <span
                          style={{
                            fontSize: "13px",
                            color: "var(--text-primary)",
                          }}
                        >
                          {opt.label}
                        </span>
                        {opt.sub && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {opt.sub}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment proof */}
                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "10px 16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginBottom: "10px",
                    }}
                  >
                    Payment Proof
                  </p>
                  <label style={{ cursor: "pointer" }}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        setPaymentFile(e.target.files?.[0] || null)
                      }
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Upload size={14} color="var(--text-secondary)" />
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {paymentFile ? (
                          paymentFile.name
                        ) : (
                          <>
                            Upload <span style={{ color: "#E24B4A" }}>one</span>{" "}
                            image of your payment proof here
                          </>
                        )}
                      </span>
                    </div>
                  </label>
                </div>

                {error && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#E24B4A",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  onClick={handleBooking}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "10px",
                    border: "none",
                    background: loading ? "#9A9A94" : "var(--text-primary)",
                    color: "var(--bg-cream)",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  {loading ? "Memproses..." : "Book Now"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
      .book-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        align-items: start;
      }
      @media (min-width: 768px) {
        .book-layout {
          grid-template-columns: 1fr 1.4fr;
          gap: 24px;
          align-items: start;
        }
      }
      `}</style>
    </main>
  );
}
