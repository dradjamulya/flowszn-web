"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/archive") ||
    pathname.startsWith("/detailarchive") ||
    pathname.startsWith("/book");  // ← tambah ini

  const hideFooter =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/book") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/archive") ||
    pathname.startsWith("/detailarchive");

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
