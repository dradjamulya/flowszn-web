"use client";
import { useState } from "react";
import { MapPin, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/layout/BackButton";
import { submitBooking } from "@/lib/actions/booking";

const eventData = {
  title: "Purple Flow",
  date: "May 29, 2026",
  time: "08:00",
  instructor: "Coach Fanny",
  location: "ACC Unair",
  desc: "Get yourself relaxed in a purple themed flow to celebrate mother's day! Happy mother's day, Mothers!",
  benefits: [
    "ESQA Products",
    "Teazzi",
    "Kanalu",
    "Shihlin (Mini special size)",
    "Documentation",
    "After movie",
  ],
  image:
    "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
};

export default function BookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useProfile, setUseProfile] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [bookingOption, setBookingOption] = useState<"personal" | "bestie">(
    "personal",
  );
  const [matReservation, setMatReservation] = useState<"no" | "yes">("no");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const handleBooking = async () => {
    if (!form.name || !form.email || !form.whatsapp) {
      setError("Mohon isi semua field terlebih dahulu.");
      return;
    }
    if (!paymentFile) {
      setError("Mohon upload bukti pembayaran.");
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
      session_id: "73db317d-38af-46a0-8fa0-9697f0f60300",
      payment_proof: paymentFile,
    });

    setLoading(false);

    if (result.success) {
      router.push("/book/thanks");
    } else {
      setError(result.error || "Terjadi kesalahan, coba lagi.");
    }
  };

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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F0EDE5",
        padding: "130px 0 40px",
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

        {/* Two column layout */}
        <div className="book-layout">
          {/* Left — Event Detail */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
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
                {eventData.date}
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
                  src={eventData.image}
                  alt={eventData.title}
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
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src="https://i.pravatar.cc/40?img=47"
                  alt="instructor"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                {eventData.instructor}
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
                  {eventData.location}
                </span>
              </div>
              <span
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                {eventData.time}
              </span>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                lineHeight: "1.6",
              }}
            >
              {eventData.desc}
            </p>

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
                {eventData.benefits.map((b, i) => (
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
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
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

            {/* Use profile */}
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

            {/* Name */}
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
                  marginBottom: "6px",
                }}
              >
                Name
              </p>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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

            {/* Email */}
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
                  marginBottom: "6px",
                }}
              >
                Email
              </p>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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

            {/* Whatsapp */}
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
                  marginBottom: "6px",
                }}
              >
                Whatsapp Number
              </p>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
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
                      style={{ fontSize: "13px", color: "var(--text-primary)" }}
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
                    onClick={() => setMatReservation(opt.val as "no" | "yes")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <Checkbox
                      checked={matReservation === opt.val}
                      onClick={() => setMatReservation(opt.val as "no" | "yes")}
                    />
                    <span
                      style={{ fontSize: "13px", color: "var(--text-primary)" }}
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
                  onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                />
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Upload size={14} color="var(--text-secondary)" />
                  <span
                    style={{ fontSize: "12px", color: "var(--text-secondary)" }}
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

            {/* Error message */}
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

            {/* Book Now */}
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
          </div>
        </div>
      </div>

      <style>{`
        .book-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .book-layout {
            grid-template-columns: 1fr 1.3fr;
            gap: 20px;
            align-items: start;
          }
        }
      `}</style>
    </main>
  );
}
