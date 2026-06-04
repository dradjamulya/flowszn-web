import BackButton from "@/components/layout/BackButton";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

// ✅ Ganti jadi
export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) notFound();

  // Fetch gallery photos untuk event ini
  const { data: galleryImages } = await supabase
    .from("gallery")
    .select("photo_url")
    .eq("event_id", id)
    .order("created_at", { ascending: true });

  // Fetch jumlah peserta (bookings verified)
  const { data: eventSessions } = await supabase
    .from("sessions")
    .select("id")
    .eq("event_id", id);

  const sessionIds = eventSessions?.map((s) => s.id) ?? [];

  const { count: participantCount } =
    sessionIds.length > 0
      ? await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .in("session_id", sessionIds)
          .eq("status", "verified")
      : { count: 0 };

  // Fetch satu testimoni untuk event ini
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("review_text, avatar_url")
    .eq("event_id", id)
    .limit(1);

  const testimonial = testimonials?.[0] ?? null;
  const images = galleryImages?.map((g) => g.photo_url) ?? [];
  const participants = participantCount ?? 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #F8F5EE 0%, #EEEAE2 48%, #D8D6D0 100%)",
        color: "#1E1E1A",
        padding: "74px 24px 56px",
      }}
    >
      <BackButton href="/archive" />

      <div style={{ width: "100%", maxWidth: "1180px", margin: "0 auto" }}>
        <header style={{ marginBottom: "30px" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(42px, 6vw, 62px)",
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              marginBottom: "18px",
            }}
          >
            {event.title}
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: "#77746D",
              lineHeight: 1.6,
              maxWidth: "1000px",
            }}
          >
            {event.description}
          </p>
        </header>

        <section
          className="archive-info-bar"
          style={{
            width: "100%",
            minHeight: "96px",
            background: "#464642",
            border: "12px solid #7A7770",
            borderRadius: "16px",
            display: "grid",
            gridTemplateColumns: "280px 1fr 64px",
            overflow: "hidden",
            marginBottom: "34px",
          }}
        >
          <div
            style={{
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              borderRight: "12px solid #7A7770",
              color: "#F3EEE5",
            }}
          >
            <span
              style={{
                fontSize: "54px",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "0.02em",
              }}
            >
              {participants}
            </span>
            <span style={{ fontSize: "15px", color: "#E7E2DA" }}>
              flowies <i>participated</i>
            </span>
          </div>

          <div
            style={{
              padding: "18px 28px",
              display: "flex",
              alignItems: "center",
              gap: "18px",
              color: "#F3EEE5",
            }}
          >
            {testimonial ? (
              <>
                {testimonial.avatar_url ? (
                  <img
                    src={testimonial.avatar_url}
                    alt="Flowies testimonial"
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "999px",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "999px",
                      background: "#6B6860",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    🌸
                  </div>
                )}
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.6,
                    color: "#F3EEE5",
                  }}
                >
                  {testimonial.review_text}
                </p>
              </>
            ) : (
              <p
                style={{
                  fontSize: "16px",
                  color: "#9A9790",
                  fontStyle: "italic",
                }}
              >
                Belum ada testimoni untuk event ini.
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F3EEE5",
            }}
          >
            <ArrowRight size={28} />
          </div>
        </section>

        {/* Gallery — tampil hanya kalau ada foto */}
        {images.length > 0 && (
          <section className="detail-gallery">
            <div className="gallery-left">
              <img
                src={images[0]}
                alt={`${event.title} 1`}
                className="gallery-large"
              />
              {images.length >= 3 && (
                <div className="gallery-bottom">
                  <img src={images[2]} alt={`${event.title} 3`} />
                  {images[3] && (
                    <img src={images[3]} alt={`${event.title} 4`} />
                  )}
                </div>
              )}
            </div>
            {images[1] && (
              <img
                src={images[1]}
                alt={`${event.title} 2`}
                className="gallery-tall"
              />
            )}
          </section>
        )}

        <footer
          style={{
            textAlign: "center",
            marginTop: "96px",
            color: "#9A9790",
            fontSize: "12px",
          }}
        >
          © 2026 flowszn. All rights reserved.
        </footer>
      </div>

      <style>{`
        .detail-gallery {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        .gallery-left { display: grid; gap: 28px; }
        .gallery-large {
          width: 100%; height: 430px;
          object-fit: cover; border-radius: 16px; display: block;
        }
        .gallery-bottom { display: grid; grid-template-columns: 1fr; gap: 28px; }
        .gallery-bottom img {
          width: 100%; height: 220px;
          object-fit: cover; border-radius: 16px; display: block;
        }
        .gallery-tall {
          width: 100%; height: 680px;
          object-fit: cover; border-radius: 16px; display: block;
        }
        @media (min-width: 900px) {
          .detail-gallery { grid-template-columns: 2fr 1.05fr; gap: 28px; align-items: stretch; }
          .gallery-large { height: 390px; }
          .gallery-bottom { grid-template-columns: 1fr 1fr; }
          .gallery-bottom img { height: 220px; }
          .gallery-tall { height: 638px; }
        }
        @media (max-width: 767px) {
          main { padding: 64px 32px 48px !important; }
          .archive-info-bar { grid-template-columns: 1fr !important; border-width: 8px !important; }
          .archive-info-bar > div { border-right: none !important; border-bottom: 8px solid #7A7770; }
          .archive-info-bar > div:last-child { border-bottom: none !important; padding: 18px; }
          .gallery-large, .gallery-tall, .gallery-bottom img { height: 260px !important; }
        }
      `}</style>
    </main>
  );
}
