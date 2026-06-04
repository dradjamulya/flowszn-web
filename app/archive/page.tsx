"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import BackButton from "@/components/layout/BackButton";
import { Flower2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ArchiveItem = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  coming_soon: boolean;
  status: string;
};

export default function ArchivePage() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchive = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("events")
        .select("id, title, description, thumbnail_url, coming_soon, status")
        .or("status.eq.completed,coming_soon.eq.true")
        .order("created_at", { ascending: false });

      if (data) setItems(data);
      setLoading(false);
    };

    fetchArchive();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #F8F5EE 0%, #EEEAE2 48%, #D8D6D0 100%)",
        color: "#1E1E1A",
        padding: "100px 32px 64px",
      }}
    >
      <BackButton href="/" />

      <div style={{ width: "100%", maxWidth: "1180px", margin: "0 auto" }}>
        <header style={{ marginBottom: "42px" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(40px, 6vw, 62px)",
              fontWeight: 400,
              lineHeight: 1,
              marginBottom: "18px",
              letterSpacing: "-0.02em",
            }}
          >
            Archive Gallery
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#8A8780",
              lineHeight: 1.6,
              marginBottom: "26px",
              maxWidth: "760px",
            }}
          >
            See through the highlights of our previous events and get a feel for
            the ambience you can expect!
          </p>
          <Flower2 size={28} color="#464642" strokeWidth={1.7} />
        </header>

        {loading ? (
          <div
            style={{ textAlign: "center", padding: "80px 0", color: "#8A8780" }}
          >
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "80px 0", color: "#8A8780" }}
          >
            Belum ada archive.
          </div>
        ) : (
          <section className="archive-grid">
            {items.map((item) => (
              <article
                key={item.id}
                className="archive-card"
                style={{
                  background: "#FFFFFF",
                  borderRadius: "22px",
                  overflow: "hidden",
                  boxShadow: "0 22px 48px rgba(30, 30, 26, 0.10)",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: "100%",
                    height: "215px",
                    overflow: "hidden",
                    background: item.coming_soon
                      ? "linear-gradient(135deg, #D8D5CE 0%, #F0EDE5 100%)"
                      : "#D8D5CE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.coming_soon ? (
                    <p
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "32px",
                        fontStyle: "italic",
                        color: "#2D2D29",
                      }}
                    >
                      coming soon
                    </p>
                  ) : item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "#E8E4DC",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#9A9A94",
                        fontSize: "13px",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "28px" }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "24px",
                      fontWeight: 400,
                      lineHeight: 1.2,
                      marginBottom: "16px",
                      color: "#2D2D29",
                    }}
                  >
                    {item.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.7,
                      color: "#8A8780",
                      minHeight: "74px",
                      marginBottom: "34px",
                    }}
                  >
                    {item.description}
                  </p>

                  {item.coming_soon ? (
                    <button
                      disabled
                      style={{
                        width: "100%",
                        height: "42px",
                        borderRadius: "8px",
                        border: "2px solid #A6A39C",
                        background: "transparent",
                        color: "#A6A39C",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "not-allowed",
                      }}
                    >
                      More
                    </button>
                  ) : (
                    <Link
                      href={`/archive/${item.id}`}
                      style={{
                        width: "100%",
                        height: "42px",
                        borderRadius: "8px",
                        border: "2px solid #464642",
                        background: "transparent",
                        color: "#464642",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      More
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        <footer
          style={{
            textAlign: "center",
            marginTop: "112px",
            color: "#9A9790",
            fontSize: "11px",
          }}
        >
          © 2026 flowszn. All rights reserved.
        </footer>
      </div>

      <style>{`
  .archive-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 34px;
  }
  .archive-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .archive-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 28px 60px rgba(30, 30, 26, 0.16) !important;
  }
  @media (min-width: 768px) {
    main { padding: 100px 48px 72px !important; }
    .archive-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 38px 34px;
    }
  }
  @media (min-width: 1024px) {
    .archive-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 42px 34px;
    }
  }
  @media (max-width: 480px) {
    main { padding: 88px 32px 48px !important; }  /* ← ubah 20px → 32px */
  }
`}</style>
    </main>
  );
}
