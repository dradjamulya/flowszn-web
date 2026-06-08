"use client";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function TestimonialCarousel({
  testimonials,
  participants,
}: {
  testimonials: {
    review_text: string;
    avatar_url: string | null;
    name: string | null;
  }[];
  participants: number;
}) {
  const [index, setIndex] = useState(0);
  const testimonial = testimonials[index];
  const total = testimonials.length;

  return (
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
      {/* Participants */}
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

      {/* Testimonial */}
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
            {/* Arrow kiri + avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              {total > 1 && (
                <button
                  onClick={() => setIndex((i) => (i - 1 + total) % total)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#F3EEE5",
                    display: "flex",
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={20} />
                </button>
              )}
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
            </div>

            <div style={{ flex: 1 }}>
              <p
                style={{ fontSize: "16px", lineHeight: 1.6, color: "#F3EEE5" }}
              >
                {testimonial.review_text}
              </p>
              {total > 1 && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#9A9790",
                    marginTop: "4px",
                    fontStyle: "italic",
                  }}
                >
                  — {testimonial.name ?? "Anonymous"}
                </p>
              )}
            </div>
          </>
        ) : (
          <p
            style={{ fontSize: "16px", color: "#9A9790", fontStyle: "italic" }}
          >
            Belum ada testimoni untuk event ini.
          </p>
        )}
      </div>

      {/* Arrow kanan saja */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F3EEE5",
        }}
      >
        <button
          onClick={() => setIndex((i) => (i + 1) % total)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: total > 1 ? "#F3EEE5" : "#6B6860",
            display: "flex",
          }}
          disabled={total <= 1}
        >
          <ArrowRight size={28} />
        </button>
      </div>
    </section>
  );
}
