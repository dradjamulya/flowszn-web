"use client";
import { useState } from "react";
import Image from "next/image";

const totalStamps = 12;
const filledStamps = 1; // nanti dari database

export default function MySznPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Shaz",
    email: "nonashaz@gmail.com",
    whatsapp: "081803210006",
  });
  const [editData, setEditData] = useState(profile);

  const handleToggleEdit = () => {
    if (isEditing) {
      setProfile(editData);
      setIsEditing(false);
    } else {
      setEditData(profile);
      setIsEditing(true);
    }
  };

  return (
    <main
      style={{
        paddingTop: "140px",
        minHeight: "100vh",
        background: "#F0EDE5",
        paddingBottom: "80px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px" }}>
        {/* Welcome Back */}
        <h1
          className="myszn-welcome"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(36px, 5vw, 64px)",
            color: "var(--text-primary)",
            textAlign: "right",
            marginBottom: "48px",
            lineHeight: 1.1,
          }}
        >
          Welcome back!
        </h1>

        {/* Two column layout */}
        <div className="myszn-layout">
          {/* LEFT — Loyalty Card */}
          <div style={{ position: "relative" }}>
            {/* Pill label */}
            <div
              style={{
                position: "absolute",
                top: "-22px",
                left: "24px",
                background: "#5A5A55",
                borderRadius: "999px",
                padding: "12px 28px",
                zIndex: 2,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "18px",
                  color: "white",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                Flowies Loyalty Card
              </p>
            </div>

            {/* Card box */}
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "60px 28px 28px",
                border: "1px solid var(--border)",
              }}
            >
              {/* Stamp grid — 4 columns x 3 rows */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "14px",
                  marginBottom: "28px",
                }}
              >
                {Array.from({ length: totalStamps }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: "1",
                      borderRadius: "14px",
                      border: "1.5px solid #D0CCC4",
                      background: i < filledStamps ? "#F0EDE5" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {i === 0 && (
                      <Image
                        src="/LOGO FLOWSZN PUTIH.svg"
                        alt="stamp"
                        width={60}
                        height={60}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  textAlign: "center",
                }}
              >
                Please contact us if there has been a mistake on the stamp
              </p>
            </div>
          </div>

          {/* RIGHT — Profile */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "32px 28px",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                background: "#D4CFC6",
              }}
            >
              <img
                src="https://i.pravatar.cc/80?img=47"
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Fields */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Whatsapp Number", key: "whatsapp", type: "tel" },
              ].map((field) => (
                <div
                  key={field.key}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      marginBottom: "4px",
                    }}
                  >
                    {field.label}
                  </p>
                  {isEditing ? (
                    <input
                      type={field.type}
                      value={editData[field.key as keyof typeof editData]}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [field.key]: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        background: "transparent",
                      }}
                    />
                  ) : (
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                      }}
                    >
                      {profile[field.key as keyof typeof profile]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Update Profile / Done button */}
            <button
              onClick={handleToggleEdit}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: isEditing ? "#22c55e" : "var(--text-primary)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s ease",
                marginTop: "8px",
              }}
            >
              {isEditing ? "Done" : "Update Profile"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
  .myszn-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;
  }
  @media (min-width: 768px) {
    .myszn-layout {
      grid-template-columns: 1.1fr 1fr;
      gap: 24px;
      align-items: start;
    }
  }
  @media (max-width: 767px) {
    .myszn-welcome {
      margin-bottom: 56px !important;
      text-align: center !important;
    }
  }
`}</style>
    </main>
  );
}
