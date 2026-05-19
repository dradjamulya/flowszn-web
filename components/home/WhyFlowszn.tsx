import { GraduationCap, Calendar, Brain } from "lucide-react";

const features = [
  {
    icon: <GraduationCap size={28} />,
    title: "Expert Instructors",
    desc: "Our certified teachers bring years of experience and deep compassion to guide your practice safely and effectively.",
  },
  {
    icon: <Calendar size={28} />,
    title: "Flexible Scheduling",
    desc: "With classes from sunrise to sunset, 7 days a week, finding time for yourself has never been easier.",
  },
  {
    icon: <Brain size={28} />,
    title: "Mind & Body Balance",
    desc: "Beyond physical postures, we focus on breathwork and meditation to restore harmony to your nervous system.",
  },
];

export default function WhyFlowszn() {
  return (
    <section style={{ padding: "64px 32px", background: "var(--bg-cream)" }}>
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 5vw, 40px)",
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
            maxWidth: "360px",
            margin: "0 auto",
            lineHeight: "1.7",
          }}
        >
          We believe in a holistic approach to wellness, providing a sanctuary
          for your mind, body, and spirit.
        </p>
      </div>

      {/* Cards */}
      <div className="why-grid">
        {features.map((f, i) => (
          <div
            key={i}
            style={{
              background: i === 1 ? "#D4CFC6" : "#E8E4DC",
              borderRadius: "24px",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ color: "var(--text-primary)" }}>{f.icon}</div>
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
          .why-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
