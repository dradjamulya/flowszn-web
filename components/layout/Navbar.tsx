"use client";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Waves, User } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMySzn = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/my-szn");
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 32px",
          background: "#464642",
          position: "relative",
        }}
      >
        <div style={{ width: "72px" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: pathname === "/" ? "600" : "400",
              color: pathname === "/" ? "#232321" : "#D4D0C8",
            }}
          >
            <Leaf size={14} /> theSZN
          </Link>

          <Link
            href="/schedule"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: pathname === "/schedule" ? "600" : "400",
              color: pathname === "/schedule" ? "#232321" : "#D4D0C8",
            }}
          >
            <Waves size={14} /> Flow
          </Link>

          <a
            href="/my-szn"
            onClick={handleMySzn}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: pathname === "/my-szn" ? "600" : "400",
              color: pathname === "/my-szn" ? "#232321" : "#D4D0C8",
              cursor: "pointer",
            }}
          >
            <User size={14} /> mySZN
          </a>
        </div>
      </nav>

      {/* Wave */}
      <div style={{ position: "relative", lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 56"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%" }}
        >
          <path
            d="M0,0 C300,56 600,56 900,28 C1100,8 1300,0 1440,20 L1440,0 Z"
            fill="#464642"
          />
          <path
            d="M0,0 C300,56 600,56 900,28 C1100,8 1300,0 1440,20 L1440,56 L0,56 Z"
            fill="var(--bg-cream)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: "32px",
            top: "-36px",
            zIndex: 20,
          }}
        >
          <Link href="/">
            <Image
              src="/LOGO FLOWSZN PUTIH.svg"
              alt="flowszn"
              width={72}
              height={72}
              className="rounded-full"
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))" }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
