# 🌿 Flowszn Web

> *Find your flow, Feel your season*

Platform booking yoga & wellness event berbasis web untuk komunitas Flowszn Surabaya. Dibangun dengan Next.js 15, Supabase, dan Resend.

---

## ✨ Features

- **Event Booking** — User bisa browse, filter, dan book event yoga dengan upload bukti pembayaran
- **Admin Dashboard** — Kelola event, verifikasi pembayaran, dan monitor revenue & occupancy
- **Find Your Flow** — Algoritma rekomendasi event berdasarkan preferensi user
- **Archive Gallery** — Dokumentasi event sebelumnya dengan galeri foto dan testimoni
- **Email Notifikasi** — Admin otomatis mendapat notifikasi email saat ada booking baru
- **Loyalty Stamps** — Sistem stamp untuk user yang sudah mengikuti event
- **Auth System** — Register, login, forgot password dengan Supabase Auth

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Database & Auth | [Supabase](https://supabase.com/) (PostgreSQL + RLS) |
| Storage | Supabase Storage |
| Email | [Resend](https://resend.com/) |
| Styling | Tailwind CSS + inline styles |
| UI Components | shadcn/ui |
| Language | TypeScript |
| Deployment | Vercel |

---

## 📁 Project Structure

```
flowszn-web/
├── app/
│   ├── admin/          # Admin dashboard (events, payments, users, analytics)
│   ├── archive/        # Archive page & detail per event
│   ├── book/           # Booking flow & thank you page
│   ├── login/          # Auth pages
│   ├── my-szn/         # User profile & booking history
│   ├── schedule/       # Browse & filter upcoming events
│   └── page.tsx        # Homepage
├── components/
│   ├── archive/        # Testimonial carousel
│   ├── home/           # Hero, upcoming events, testimonials, CTA
│   ├── layout/         # Navbar, footer, back button
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── actions/        # Server actions (booking, email)
│   └── supabase/       # Supabase client & server helpers
└── public/             # Static assets & SVGs
```

---

## 🗄 Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profile data (name, phone, role) |
| `events` | Event data (title, location, instructor, status) |
| `sessions` | Sesi per event (date, price, slots) |
| `bookings` | Data booking user |
| `payments` | Bukti pembayaran & status verifikasi |
| `gallery` | Foto dokumentasi per event |
| `testimonials` | Testimoni user per event |
| `stamps` | Loyalty stamp user per event |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm atau yarn
- Akun [Supabase](https://supabase.com/)
- Akun [Resend](https://resend.com/)

### Installation

```bash
# Clone repo
git clone https://github.com/dradjamulya/flowszn-web.git
cd flowszn-web

# Install dependencies
npm install
```

### Environment Variables

Buat file `.env.local` di root project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_admin_email@example.com
```

### Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 👤 User Roles

| Role | Access |
|------|--------|
| `user` | Browse events, booking, lihat history di My Szn |
| `admin` | Semua akses user + kelola event, verifikasi payment, dashboard analytics |

---

## 📧 Email Notifications

Saat ada booking baru, sistem otomatis mengirim email notifikasi ke admin berisi:
- Nama & kontak user
- Detail booking (opsi, mat reservation)
- Link bukti pembayaran

> ⚠️ Untuk production, setup domain di Resend agar email tidak masuk spam.

---

## 🔒 Security

- Row Level Security (RLS) aktif di semua tabel Supabase
- `payment-proofs` bucket bersifat private (akses via signed URL)
- Admin route dilindungi middleware auth
- Environment variables tidak di-commit ke repository

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/schedule` | Browse & filter upcoming events |
| `/archive` | Archive highlight events sebelumnya |
| `/archive/[id]` | Detail archive per event |
| `/book/[id]` | Form booking event |
| `/book/thanks` | Halaman konfirmasi booking |
| `/my-szn` | Profile & booking history user |
| `/login` | Login |
| `/register` | Register |
| `/admin` | Dashboard analytics admin |
| `/admin/events` | Kelola events |
| `/admin/payments` | Verifikasi pembayaran |
| `/admin/users` | Kelola users |
| `/admin/archive` | Kelola archive & gallery |

---

## 🌿 About Flowszn

Flowszn adalah komunitas yoga & wellness di Surabaya yang mengadakan sesi outdoor maupun indoor secara rutin. Platform ini dibangun untuk memudahkan proses booking dan dokumentasi setiap event yang diadakan.

---

*© 2026 Flowszn Indonesia. All rights reserved.*