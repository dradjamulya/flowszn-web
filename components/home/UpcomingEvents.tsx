import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function UpcomingEvents() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(3);

  if (!events || events.length === 0) return null;

  return (
    <section style={{ padding: "80px 0", background: "#EFEDE8" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "8px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(26px, 4vw, 38px)",
              color: "var(--text-primary)",
              lineHeight: "1.2",
            }}
          >
            Archive Highlights
          </h2>

          <Link
            href="/archive"
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              marginTop: "8px",
            }}
          >
            View Full Archive →
          </Link>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            marginBottom: "48px",
            lineHeight: "1.6",
            maxWidth: "440px",
          }}
        >
          See the beautiful moments and vibrant energy captured in our previous
          events, and get a feel for the ambience you can expect!
        </p>

        <div className="events-grid">
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  aspectRatio: "16/10",
                }}
              >
                <img
                  src={
                    event.thumbnail_url ??
                    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80"
                  }
                  alt={event.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div
                style={{
                  padding: "20px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "17px",
                      color: "var(--text-primary)",
                      fontWeight: "600",
                    }}
                  >
                    {event.title}
                  </h3>

                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      whiteSpace: "nowrap",
                      marginLeft: "8px",
                    }}
                  >
                    {event.level}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.6",
                    flex: 1,
                  }}
                >
                  {event.description}
                </p>

                <Link
                  href={`/archive/${event.id}`}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "999px",
                    border: "1.5px solid var(--text-primary)",
                    background: "transparent",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    marginTop: "8px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  View Highlight
                </Link>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          .events-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }

          @media (min-width: 768px) {
            .events-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
