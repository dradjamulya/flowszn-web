"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  CreditCard,
  TrendingUp,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

const COLORS = {
  pending: "#C17B2A",
  verified: "#4A7A5A",
  rejected: "#A03030",
  area: "#464642",
};

export default function AdminDashboard() {
  const [kpi, setKpi] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    revenueThisMonth: 0,
    activeEvents: 0,
  });
  const [paymentPipeline, setPaymentPipeline] = useState<any[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [eventOccupancy, setEventOccupancy] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const supabase = createClient();

      // ── 1. KPI ──────────────────────────────────────────────
      const [
        usersRes,
        activeEventsRes,
        pendingRes,
        paymentsRes,
        profilesRes,
        sessionsRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("events")
          .select("id", { count: "exact", head: true })
          .eq("status", "on_sale"),
        supabase
          .from("payments")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending_verification"),
        supabase.from("payments").select("status, booking_id, created_at"),
        supabase
          .from("profiles")
          .select("created_at")
          .order("created_at", { ascending: true }),
        supabase
          .from("sessions")
          .select("id, price, booked_slots, total_slots, events(title)"),
      ]);

      // Revenue bulan ini — dari verified payments × session price
      const now = new Date();
      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ).toISOString();
      const verifiedThisMonth = (paymentsRes.data ?? []).filter(
        (p) => p.status === "verified" && p.created_at >= startOfMonth,
      );

      // Ambil booking details untuk verified payments
      let revenueThisMonth = 0;
      if (verifiedThisMonth.length > 0) {
        const bookingIds = verifiedThisMonth.map((p) => p.booking_id);
        const { data: bookings } = await supabase
          .from("bookings")
          .select("id, booking_option, session_id, sessions(price)")
          .in("id", bookingIds);

        revenueThisMonth = (bookings ?? []).reduce((sum, b) => {
          const price = b.sessions?.price ?? 0;
          const pax = b.booking_option === "bestie" ? 2 : 1;
          return sum + price * pax;
        }, 0);
      }

      setKpi({
        totalUsers: usersRes.count ?? 0,
        pendingVerifications: pendingRes.count ?? 0,
        revenueThisMonth,
        activeEvents: activeEventsRes.count ?? 0,
      });

      // ── 2. Payment Pipeline (7 hari terakhir) ───────────────
      const sevenDaysAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const recentPayments = (paymentsRes.data ?? []).filter(
        (p) => p.created_at >= sevenDaysAgo,
      );
      const pipeline = ["pending_verification", "verified", "rejected"]
        .map((status) => ({
          name:
            status === "pending_verification"
              ? "Pending"
              : status === "verified"
                ? "Verified"
                : "Rejected",
          value: recentPayments.filter((p) => p.status === status).length,
          color:
            status === "pending_verification"
              ? COLORS.pending
              : status === "verified"
                ? COLORS.verified
                : COLORS.rejected,
        }))
        .filter((d) => d.value > 0);
      setPaymentPipeline(
        pipeline.length > 0
          ? pipeline
          : [{ name: "No Data", value: 1, color: "#E8E4DC" }],
      );

      // ── 3. Revenue Trend (per bulan, 6 bulan terakhir) ──────
      const allVerified = (paymentsRes.data ?? []).filter(
        (p) => p.status === "verified",
      );
      const { data: allBookings } = await supabase
        .from("bookings")
        .select("id, booking_option, session_id, sessions(price), created_at")
        .in(
          "id",
          allVerified.map((p) => p.booking_id),
        );

      const monthLabels = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
          label: d.toLocaleDateString("id-ID", {
            month: "short",
            year: "2-digit",
          }),
        };
      });

      const revenueByMonth: Record<string, number> = {};
      (allBookings ?? []).forEach((b) => {
        const key = b.created_at?.slice(0, 7);
        const price = (b as any).sessions?.price ?? 0;
        const pax = b.booking_option === "bestie" ? 2 : 1;
        revenueByMonth[key] = (revenueByMonth[key] ?? 0) + price * pax;
      });

      setRevenueTrend(
        monthLabels.map((m) => ({
          month: m.label,
          revenue: revenueByMonth[m.key] ?? 0,
        })),
      );

      // ── 4. Event Occupancy ───────────────────────────────────
      const sessions = sessionsRes.data ?? [];
      const occupancyMap: Record<string, { booked: number; total: number }> =
        {};
      sessions.forEach((s: any) => {
        const title = s.events?.title ?? "Unknown";
        if (!occupancyMap[title]) occupancyMap[title] = { booked: 0, total: 0 };
        occupancyMap[title].booked += s.booked_slots ?? 0;
        occupancyMap[title].total += s.total_slots ?? 0;
      });
      const occupancy = Object.entries(occupancyMap)
        .map(([name, d]) => ({
          name,
          pct: d.total > 0 ? Math.round((d.booked / d.total) * 100) : 0,
          booked: d.booked,
          total: d.total,
        }))
        .sort((a, b) => b.pct - a.pct);
      setEventOccupancy(occupancy);

      // ── 5. User Growth (kumulatif per bulan) ─────────────────
      const profiles = profilesRes.data ?? [];
      const growthByMonth: Record<string, number> = {};
      profiles.forEach((p) => {
        const key = p.created_at?.slice(0, 7);
        if (key) growthByMonth[key] = (growthByMonth[key] ?? 0) + 1;
      });

      let cumulative = 0;
      const growthData = monthLabels.map((m) => {
        cumulative += growthByMonth[m.key] ?? 0;
        return { month: m.label, users: cumulative };
      });
      setUserGrowth(growthData);

      setLoading(false);
    };

    fetchAll();
  }, []);

  const formatRupiah = (val: number) =>
    val >= 1_000_000
      ? `Rp ${(val / 1_000_000).toFixed(1)}jt`
      : `Rp ${val.toLocaleString("id-ID")}`;

  const kpiCards = [
    {
      label: "Total Active Users",
      value: loading ? "—" : kpi.totalUsers.toLocaleString(),
      icon: Users,
      color: "#464642",
      sub: "Flowies terdaftar",
    },
    {
      label: "Pending Verifications",
      value: loading ? "—" : kpi.pendingVerifications,
      icon: AlertCircle,
      color: kpi.pendingVerifications > 0 ? "#C17B2A" : "#4A7A5A",
      sub:
        kpi.pendingVerifications > 0
          ? "Perlu ditindaklanjuti!"
          : "Semua clear ✓",
      highlight: kpi.pendingVerifications > 0,
    },
    {
      label: "Revenue Bulan Ini",
      value: loading ? "—" : formatRupiah(kpi.revenueThisMonth),
      icon: TrendingUp,
      color: "#5A7A6A",
      sub: "Dari booking verified",
    },
    {
      label: "Active Events",
      value: loading ? "—" : kpi.activeEvents,
      icon: CalendarDays,
      color: "#6040A0",
      sub: "Sedang buka pendaftaran",
    },
  ];

  const CustomTooltipRupiah = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>
            {label}
          </p>
          <p style={{ fontWeight: "600", color: "var(--text-primary)" }}>
            {formatRupiah(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Page Title */}
      <h1
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "28px",
          color: "var(--text-primary)",
          marginBottom: "4px",
        }}
      >
        Dashboard
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          marginBottom: "32px",
        }}
      >
        Overview performa flowszn hari ini.
      </p>

      {/* ── KPI Cards ─────────────────────────────────── */}
      <div className="kpi-grid" style={{ marginBottom: "24px" }}>
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "clamp(14px, 3vw, 20px) clamp(14px, 3vw, 24px)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border: card.highlight
                  ? "1.5px solid #C17B2A"
                  : "1px solid var(--border)",
                boxShadow: card.highlight
                  ? "0 0 0 4px rgba(193,123,42,0.08)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: "clamp(40px, 5vw, 52px)",
                  height: "clamp(40px, 5vw, 52px)",
                  borderRadius: "14px",
                  background: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} color="white" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "10px",
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontSize: "clamp(18px, 4vw, 26px)",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: card.highlight ? "#C17B2A" : "var(--text-secondary)",
                    marginTop: "4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {card.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Row 2: Pipeline + Revenue ─────────────────── */}
      <div className="charts-row" style={{ marginBottom: "24px" }}>
        {/* Donut — Payment Pipeline */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid var(--border)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "4px",
            }}
          >
            Payment Pipeline
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "16px",
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}
          >
            Status Pembayaran
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginBottom: "16px",
            }}
          >
            7 hari terakhir
          </p>
          {loading ? (
            <div
              style={{
                height: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                Loading...
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={paymentPipeline}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {paymentPipeline.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Line — Revenue Trend */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid var(--border)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "4px",
            }}
          >
            Revenue Trend
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "16px",
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}
          >
            Tren Pendapatan
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginBottom: "16px",
            }}
          >
            6 bulan terakhir
          </p>
          {loading ? (
            <div
              style={{
                height: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                Loading...
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={revenueTrend}
                margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE5" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9A9A94" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9A9A94" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    v >= 1000000 ? `${v / 1000000}jt` : `${v / 1000}rb`
                  }
                />
                <Tooltip content={<CustomTooltipRupiah />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#464642"
                  strokeWidth={2.5}
                  dot={{ fill: "#464642", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Row 3: Occupancy + User Growth ───────────── */}
      <div className="charts-row">
        {/* Horizontal Bar — Event Occupancy */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid var(--border)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "4px",
            }}
          >
            Event Occupancy
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "16px",
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}
          >
            Tingkat Keterisian
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginBottom: "16px",
            }}
          >
            Kapasitas terjual per event
          </p>
          {loading ? (
            <div
              style={{
                height: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                Loading...
              </p>
            </div>
          ) : eventOccupancy.length === 0 ? (
            <div
              style={{
                height: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                Belum ada data.
              </p>
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={Math.max(220, eventOccupancy.length * 52)}
            >
              <BarChart
                data={eventOccupancy}
                layout="vertical"
                margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#9A9A94" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9A9A94" }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, "Occupancy"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="pct"
                  fill="#464642"
                  radius={[0, 6, 6, 0]}
                  label={{
                    position: "right",
                    fontSize: 11,
                    fill: "#9A9A94",
                    formatter: (v: any) => `${v}%`,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Area — User Growth */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid var(--border)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "4px",
            }}
          >
            Community Growth
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "16px",
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}
          >
            Pertumbuhan User
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginBottom: "16px",
            }}
          >
            Kumulatif 6 bulan terakhir
          </p>
          {loading ? (
            <div
              style={{
                height: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                Loading...
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={userGrowth}
                margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#464642" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#464642" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE5" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9A9A94" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9A9A94" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#464642"
                  strokeWidth={2.5}
                  fill="url(#userGradient)"
                  dot={{ fill: "#464642", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <style>{`
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .charts-row {
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 1200px) {
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-row { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    .kpi-grid {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .charts-row {
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }
  }

  @media (max-width: 400px) {
    .kpi-grid { grid-template-columns: 1fr; }
  }
`}</style>
    </div>
  );
}
