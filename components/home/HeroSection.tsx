import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HeroSection() {
  const supabase = await createClient();

  // Fetch event terdekat yang on_sale atau upcoming
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select(
      `
    id, title, thumbnail_url,
    sessions ( date_time )
  `,
    )
    .in("status", ["on_sale", "upcoming"])
    .order("created_at", { ascending: true });

  // Cari event dengan session terdekat dari sekarang
  const now = new Date();
  let nextEvent: {
    id: string;
    title: string;
    dateLabel: string;
    thumbnail_url: string | null;
  } | null = null;

  if (upcomingEvents) {
    for (const event of upcomingEvents) {
      const session = (event.sessions as any[])?.[0];
      if (!session?.date_time) continue;
      const sessionDate = new Date(session.date_time);
      if (sessionDate >= now) {
        const diff = sessionDate.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        const dateLabel =
          days === 0
            ? "Today"
            : days === 1
              ? "Tomorrow"
              : days <= 7
                ? "This Week"
                : days <= 14
                  ? "Next Week"
                  : sessionDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });

        nextEvent = {
          id: event.id,
          title: event.title,
          dateLabel,
          thumbnail_url: event.thumbnail_url ?? null,
        };
        break;
      }
    }
  }

  return (
    <section style={{ padding: "40px 0 64px", background: "#EFEDE8" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          className="hero-layout"
        >
          {/* Text Content */}
          <div className="hero-text">
            <h1
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(36px, 4.5vw, 58px)",
                lineHeight: "1.15",
                color: "var(--text-primary)",
                marginBottom: "16px",
              }}
            >
              Find Your Flow,
              <br />
              Feel Your Season
            </h1>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.7",
                color: "var(--text-secondary)",
                marginBottom: "32px",
                maxWidth: "360px",
              }}
            >
              Our yoga experiences are designed to foster physical relaxation,
              mindfulness, and a deep connection with both yourself and the
              surrounding environment. We're here to help you find your perfect
              flow in every season of your life.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
              <Link
                href="/schedule"
                style={{
                  padding: "12px 24px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "500",
                  background: "var(--text-primary)",
                  color: "var(--bg-cream)",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Find my Flow
              </Link>
              <button
                style={{
                  padding: "12px 24px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "500",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                Learn More
              </button>
            </div>

            {/* Social Proof */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex" }}>
                {["#C4A882", "#A8B89C", "#B8A0C8"].map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: color,
                      border: "2px solid white",
                      marginLeft: i > 0 ? "-8px" : "0",
                    }}
                  />
                ))}
              </div>
              <div>
                <div
                  style={{ display: "flex", gap: "2px", marginBottom: "2px" }}
                >
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{ color: "#FBBF24", fontSize: "12px" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Reviewed by 100+ Flowies
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-image">
            <div
              style={{
                background: "#3A3A36",
                borderRadius: "28px",
                padding: "14px",
                position: "relative",
                boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  aspectRatio: "4/3",
                  transform: "rotate(1.5deg)",
                }}
              >
                <img
                  src={
                    nextEvent?.thumbnail_url ||
                    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                  }
                  alt="flowszn yoga class"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Floating Pill — event terdekat dari database */}
              {nextEvent && (
                <Link
                  href={`/book/${nextEvent.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: "24px",
                      left: "24px",
                      borderRadius: "999px",
                      padding: "10px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "var(--bg-cream)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                      }}
                    >
                      🧘
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                          lineHeight: 1.2,
                        }}
                      >
                        {nextEvent.title}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.2,
                        }}
                      >
                        {nextEvent.dateLabel}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .hero-layout {
              flex-direction: row !important;
              align-items: center;
              gap: 48px;
            }
            .hero-text { flex: 1.1; }
            .hero-image { flex: 1; max-width: 480px; }
          }
        `}</style>
      </div>
    </section>
  );
}
