import Image from "next/image";

const features = [
  {
    icon: <Image src="/icon-curated.svg" alt="" width={32} height={32} />,
    title: "Curated Expertise",
    desc: "Practice with confidence, knowing our sessions are guided by carefully curated, professional instructors.",
  },
  {
    icon: <Image src="/icon-seasonal.svg" alt="" width={32} height={32} />,
    title: "Unique Seasonal Events",
    desc: "Experience yoga like never before with our refreshing and ever-evolving seasonal event themes.",
  },
  {
    icon: <Image src="/icon-mindful.svg" alt="" width={32} height={32} />,
    title: "Mindful Support",
    desc: "Our diverse class levels and formats are thoughtfully designed to meet your specific needs and personal growth.",
  },
];

export default function WhyFlowszn() {
  return (
    <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(28px, 4vw, 40px)",
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            Why Flowszn
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            We are committed to provide more than just a workout, but a space
            for you to recharge and build a supportive community.
          </p>
        </div>

        <div className="why-grid">
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: i === 1 ? "#D4CFC6" : "#E8E4DC",
                borderRadius: "24px",
                padding: "40px 28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "18px",
                  color: "var(--text-primary)",
                  fontWeight: "600",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: "1.7",
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <style>{`
          .why-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          @media (min-width: 768px) {
            .why-grid { grid-template-columns: repeat(3, 1fr); }
          }
        `}</style>
      </div>
    </section>
  );
}
