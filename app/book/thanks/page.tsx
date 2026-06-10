"use client";
import BackButton from "@/components/layout/BackButton";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ThanksPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F0EDE5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BackButton href="/schedule" />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 32px",
          marginTop: "-40px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 5vw, 48px)",
            color: "var(--text-primary)",
            marginBottom: "16px",
            lineHeight: 1.2,
          }}
        >
          Thank You for Booking this Session!
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-secondary)",
            marginBottom: "12px",
          }}
        >
          We'll verify your payment and send you and email shortly
        </p>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-secondary)",
            fontStyle: "italic",
          }}
        >
          See you soon, Flowies!
        </p>
      </div>
    </main>
  );
}
