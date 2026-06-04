"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  Users,
  Archive,
  Menu,
  X,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Kelola Events", icon: CalendarDays },
  { href: "/admin/payments", label: "Verifikasi Payment", icon: CreditCard },
  { href: "/admin/archive", label: "Kelola Archive", icon: Archive },
  { href: "/admin/users", label: "Data User", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav style={{ padding: "8px 12px", flex: 1 }}>
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "4px",
              textDecoration: "none",
              background: active ? "rgba(255,255,255,0.1)" : "transparent",
              color: active ? "white" : "rgba(255,255,255,0.5)",
              fontSize: "13px",
              fontWeight: active ? "600" : "400",
            }}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0EDE5" }}>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          background: "#2A2A25",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "32px 20px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Image
              src="/LOGO FLOWSZN PUTIH.svg"
              alt="flowszn"
              width={40}
              height={40}
            />
            <div>
              <p
                style={{ fontSize: "13px", fontWeight: "600", color: "white" }}
              >
                flowszn
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        <NavLinks />

        <div style={{ padding: "0 12px 8px" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "none",
              border: "1px solid rgba(255,100,100,0.3)",
              fontSize: "13px",
              color: "rgba(255,150,150,0.8)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Back to Site */}
        <div
          style={{
            padding: "12px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "13px",
              color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <ArrowLeft size={14} /> Kembali ke Website
          </Link>
          <p
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.2)",
              marginTop: "12px",
              paddingLeft: "4px",
            }}
          >
            © 2026 flowszn
          </p>
        </div>
      </aside>

      {/* ===== MOBILE HEADER ===== */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "#2A2A25",
          padding: "14px 20px",
          alignItems: "center",
          justifyContent: "space-between",
          display: "none",
        }}
        id="admin-mobile-header"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            src="/LOGO FLOWSZN PUTIH.svg"
            alt="flowszn"
            width={32}
            height={32}
          />
          <p style={{ fontSize: "13px", fontWeight: "600", color: "white" }}>
            Admin Panel
          </p>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "white",
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ===== MOBILE DRAWER ===== */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              width: "240px",
              height: "100%",
              background: "#2A2A25",
              padding: "72px 12px 20px",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <NavLinks onClick={() => setMobileOpen(false)} />

            {/* Logout - di dalam drawer */}
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                marginTop: "8px",
                background: "none",
                border: "1px solid rgba(255,100,100,0.3)",
                fontSize: "13px",
                color: "rgba(255,150,150,0.8)",
                cursor: "pointer",
              }}
            >
              <LogOut size={14} /> Logout
            </button>

            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.1)",
                marginTop: "8px",
              }}
            >
              <ArrowLeft size={14} /> Kembali ke Website
            </Link>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main
        style={{
          marginLeft: "240px",
          padding: "48px 40px 40px",
          minHeight: "100vh",
          width: "calc(100% - 240px)",
        }}
        id="admin-main"
      >
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
          #admin-mobile-header { display: flex !important; }
          #admin-main {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 80px 20px 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
