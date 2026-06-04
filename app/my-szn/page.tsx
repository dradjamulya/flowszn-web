"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

export default function MySznPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    whatsapp: "",
    joinDate: "",
  });
  const [editData, setEditData] = useState(profile);
  const [stampCount, setStampCount] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalStamps = 12;

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { count: stamps } = await supabase
        .from("stamps")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const p = {
        name: profileData?.full_name ?? "",
        email: user.email ?? "",
        whatsapp: profileData?.phone ?? "",
        joinDate,
      };

      setProfile(p);
      setEditData(p);
      setStampCount(stamps ?? 0);
      setPhotoUrl(profileData?.photo_url ?? null);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploadingPhoto(true);

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-photos")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      alert("Gagal upload foto: " + uploadError.message);
      setUploadingPhoto(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(fileName);

    const newUrl = urlData.publicUrl + "?t=" + Date.now();

    await supabase
      .from("profiles")
      .update({ photo_url: urlData.publicUrl })
      .eq("id", userId);

    setPhotoUrl(newUrl);
    setUploadingPhoto(false);
  };

  const handleToggleEdit = async () => {
    if (isEditing) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({
            full_name: editData.name,
            phone: editData.whatsapp,
          })
          .eq("id", user.id);
      }
      setProfile(editData);
      setIsEditing(false);
    } else {
      setEditData(profile);
      setIsEditing(true);
    }
  };

  if (loading)
    return (
      <main
        style={{
          paddingTop: "140px",
          minHeight: "100vh",
          background: "#F0EDE5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </main>
    );

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

        <div className="myszn-layout">
          {/* LEFT — Loyalty Card */}
          <div style={{ position: "relative" }}>
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

            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "60px 28px 28px",
                border: "1px solid var(--border)",
              }}
            >
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
                      background: i < stampCount ? "#F0EDE5" : "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {i < stampCount && (
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
            {/* Avatar — klik untuk ganti foto */}
            <div
              onClick={handlePhotoClick}
              style={{
                position: "relative",
                width: "88px",
                height: "88px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#D4CFC6",
                cursor: "pointer",
                border: "2px solid var(--border)",
                flexShrink: 0,
              }}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                /* Default no profile */
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#E8E4DC",
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                      fill="#9A9A94"
                    />
                    <path
                      d="M4 20C4 17.7909 7.58172 16 12 16C16.4183 16 20 17.7909 20 20"
                      stroke="#9A9A94"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}

              {/* Overlay kamera */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: uploadingPhoto ? 1 : 0,
                  transition: "opacity 0.2s",
                }}
                className="photo-overlay"
              >
                {uploadingPhoto ? (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                ) : (
                  <Camera size={20} color="white" />
                )}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />

            <p
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                marginTop: "-8px",
              }}
            >
              Tap foto untuk mengganti
            </p>

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
                  {isEditing && field.key !== "email" ? (
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
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "1.5px solid #D0CCC4",
                background: "transparent",
                color: "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                marginTop: "4px",
              }}
            >
              Logout
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
        .photo-overlay { opacity: 0; }
        div:hover > .photo-overlay { opacity: 1 !important; }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
