"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*, bookings(id)")
        .order("created_at", { ascending: false });
      if (data) setUsers(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "28px",
          color: "var(--text-primary)",
          marginBottom: "8px",
        }}
      >
        Data User
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          marginBottom: "32px",
        }}
      >
        {users.length} user terdaftar
      </p>

      {loading ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            padding: "40px",
          }}
        >
          Loading...
        </p>
      ) : users.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            padding: "40px",
          }}
        >
          Belum ada user.
        </p>
      ) : (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {users.map((user, i) => (
            <div
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                gap: "16px",
                borderBottom:
                  i < users.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#D4CFC6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    flexShrink: 0,
                  }}
                >
                  {user.full_name?.[0] ?? "?"}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                    }}
                  >
                    {user.full_name ?? "No name"}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginTop: "2px",
                    }}
                  >
                    {user.phone ?? "No phone"}
                  </p>
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                    }}
                  >
                    {user.bookings?.length ?? 0} booking
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      marginTop: "2px",
                    }}
                  >
                    {new Date(user.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "500",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: user.role === "admin" ? "#E8E0F0" : "#F0F0F0",
                    color: user.role === "admin" ? "#6040A0" : "#666",
                  }}
                >
                  {user.role ?? "user"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
