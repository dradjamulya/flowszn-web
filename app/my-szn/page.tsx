"use client";
import { useState } from "react";
import { Camera, Edit2, Check, MapPin, Calendar } from "lucide-react";

const dummyUser = {
  name: "Raina Putri",
  email: "raina@gmail.com",
  phone: "081234567890",
  joinDate: "December 2025",
  totalStamps: 7,
  maxStamps: 10,
};

const dummyHistory = [
  {
    title: "Purple Flow",
    date: "May 29, 2026",
    location: "ACC Unair",
    stamp: true,
  },
  {
    title: "Morning Vinyasa",
    date: "April 12, 2026",
    location: "Taman Bungkul",
    stamp: true,
  },
  {
    title: "Iftar Flow",
    date: "March 28, 2026",
    location: "Kenjeran Park",
    stamp: true,
  },
  {
    title: "Citylight Flow",
    date: "February 14, 2026",
    location: "Pakuwon Mall",
    stamp: true,
  },
];

export default function MySznPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(dummyUser);
  const [editData, setEditData] = useState(dummyUser);

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const stamps = Array.from(
    { length: dummyUser.maxStamps },
    (_, i) => i < profile.totalStamps,
  );

  return (
    <main
      style={{
        paddingTop: "120px",
        minHeight: "100vh",
        background: "#F0EDE5",
        paddingBottom: "60px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
        {/* Profile Card */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "#D4CFC6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  overflow: "hidden",
                }}
              >
                <img
                  src="https://i.pravatar.cc/72?img=47"
                  alt="profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {isEditing && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Camera size={12} color="white" />
                </div>
              )}
            </div>

            {/* Name + join date */}
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "20px",
                    color: "var(--text-primary)",
                    border: "none",
                    borderBottom: "1px solid var(--border)",
                    outline: "none",
                    background: "transparent",
                    width: "100%",
                    marginBottom: "4px",
                  }}
                />
              ) : (
                <h2
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "20px",
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {profile.name}
                </h2>
              )}
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Flowies since {profile.joinDate}
              </p>
            </div>

            {/* Edit / Done button */}
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                background: isEditing ? "var(--text-primary)" : "transparent",
                color: isEditing ? "var(--bg-cream)" : "var(--text-primary)",
                border: "1.5px solid var(--text-primary)",
              }}
            >
              {isEditing ? <Check size={14} /> : <Edit2 size={14} />}
              {isEditing ? "Done" : "Edit Profile"}
            </button>
          </div>

          {/* Profile fields */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              { label: "Email", key: "email", type: "email" },
              { label: "Phone", key: "phone", type: "tel" },
            ].map((field) => (
              <div
                key={field.key}
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {field.label}
                </p>
                {isEditing ? (
                  <input
                    type={field.type}
                    value={editData[field.key as keyof typeof editData]}
                    onChange={(e) =>
                      setEditData({ ...editData, [field.key]: e.target.value })
                    }
                    style={{
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      border: "none",
                      borderBottom: "1px solid var(--border)",
                      outline: "none",
                      background: "transparent",
                      padding: "4px 0",
                    }}
                  />
                ) : (
                  <p style={{ fontSize: "14px", color: "var(--text-primary)" }}>
                    {profile[field.key as keyof typeof profile]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stamp Card */}
        <div
          style={{
            background: "#464642",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "18px",
                  color: "#F0EDE5",
                  marginBottom: "4px",
                }}
              >
                My Stamps
              </h3>
              <p style={{ fontSize: "12px", color: "#9A9A8A" }}>
                {profile.totalStamps}/{dummyUser.maxStamps} stamps collected
              </p>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "999px",
                padding: "6px 14px",
                fontSize: "12px",
                color: "#F0EDE5",
              }}
            >
              {dummyUser.maxStamps - profile.totalStamps} more to reward 🎁
            </div>
          </div>

          {/* Stamps grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "12px",
            }}
          >
            {stamps.map((filled, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: filled ? "#F0EDE5" : "rgba(255,255,255,0.2)",
                  background: filled ? "#F0EDE5" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                {filled ? "🧘" : ""}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                height: "4px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "999px",
                  background: "#F0EDE5",
                  width: `${(profile.totalStamps / dummyUser.maxStamps) * 100}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Booking History */}
        <div
          style={{ background: "white", borderRadius: "20px", padding: "28px" }}
        >
          <h3
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "18px",
              color: "var(--text-primary)",
              marginBottom: "20px",
            }}
          >
            My Flow History
          </h3>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {dummyHistory.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "#F8F5F0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-playfair)",
                    }}
                  >
                    {item.title}
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Calendar size={11} color="var(--text-secondary)" />
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.date}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <MapPin size={11} color="var(--text-secondary)" />
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
                {item.stamp && <div style={{ fontSize: "20px" }}>🧘</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
