export default function HeroSection() {
  return (
    <section
      style={{ padding: "40px 48px 64px", background: "var(--bg-cream)" }}
    >
      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 12px",
          borderRadius: "999px",
          border: "1px solid var(--border)",
          fontSize: "12px",
          color: "var(--text-secondary)",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#22c55e",
            display: "inline-block",
          }}
        ></span>
        Find Your Season Today
      </div>

      {/* Layout: mobile = kolom, desktop = baris */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: "40px" }}
        className="hero-layout"
      >
        {/* Text Content */}
        <div className="hero-text">
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(40px, 5vw, 64px)",
              lineHeight: "1.15",
              color: "var(--text-primary)",
              marginBottom: "16px",
            }}
          >
            Find Your Flow,
            <br />
            Find Your Season
          </h1>
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              color: "var(--text-secondary)",
              marginBottom: "32px",
              maxWidth: "380px",
            }}
          >
            Gentle, breath-led yoga classes designed for every body and every
            level. Cultivate mindfulness and strength in our serene studio.
          </p>

          <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
            <button
              style={{
                padding: "12px 24px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "500",
                background: "var(--text-primary)",
                color: "var(--bg-cream)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Find my Flow
            </button>
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
              <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: "#FBBF24", fontSize: "12px" }}>
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
        <div
          className="hero-image"
          style={{
            position: "relative",
            padding: "8px",
            margin: "0 auto",
          }}
        >
          {/* Frame gelap */}
          <div
            style={{
              background: "#3A3A36",
              borderRadius: "28px",
              padding: "14px",
              position: "relative",
              boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
            }}
          >
            {/* Foto miring */}
            <div
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                aspectRatio: "3/3",
                transform: "rotate(1.5deg)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                alt="yoga class"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Floating Pill */}
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
                  Morning Vinyasa
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.2,
                  }}
                >
                  Next Week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
  @media (min-width: 768px) {
    .hero-layout {
      flex-direction: row !important;
      align-items: center;
      gap: 32px;
    }
    .hero-text {
      flex: 1.2;
    }
    .hero-image {
      flex: 1;
      max-width: 400px;
    }
  }
    `}</style>
    </section>
  );
}
