"use client";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  BarChart2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const preferences = {
  who: {
    label: "I am a..",
    options: [
      "Morning sesh hunter",
      "Evening relief enthusiast",
      "Both morning and evening sesh lover",
    ],
  },
  enjoy: {
    label: "I enjoy..",
    options: [
      "A neat indoor flow",
      "A fresh outdoor flow",
      "Any fun place to do my flow",
    ],
  },
  goal: {
    label: "I do my flow to..",
    options: [
      "Unwind after a long weekday shift",
      "Make the most out of my weekend",
      "Embrace my day whenever I can",
    ],
  },
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function SchedulePage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);
  const [search, setSearch] = useState("");
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [showAll, setShowAll] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Record<string, string>>({
    who: "",
    enjoy: "",
    goal: "",
  });
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          sessions (
            id,
            date_time,
            price,
            total_slots,
            booked_slots
          )
        `,
        )
        .in("status", ["on_sale", "upcoming"]);

      if (!error && data) setEvents(data);
      setLoadingEvents(false);
    };
    fetchEvents();
    const fetchRole = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile) setUserRole(profile.role);
    };
    fetchRole();
  }, []);

  const toggle = (key: string, val: string) => {
    setSelected((prev) => ({ ...prev, [key]: prev[key] === val ? "" : val }));
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const progress = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    setScrollProgress(isNaN(progress) ? 0 : progress);
  };

  const scrollByDir = (dir: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!scrollRef.current) return;
    const val = parseFloat(e.target.value);
    scrollRef.current.scrollLeft =
      val * (scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
    setScrollProgress(val);
  };

  const handleFindFlow = () => {
    setShowModal(false);
  };

  const Checkbox = ({
    checked,
    onClick,
  }: {
    checked: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      style={{
        width: "18px",
        height: "18px",
        borderRadius: "4px",
        flexShrink: 0,
        border: "1.5px solid var(--text-secondary)",
        background: checked ? "var(--text-primary)" : "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );

  const filteredEvents = events.filter((e) => {
    const matchSearch =
      search === "" ||
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.instructor_name?.toLowerCase().includes(search.toLowerCase());

    const session = e.sessions?.[0];
    const matchMonth = showAll
      ? true
      : session?.date_time
        ? new Date(session.date_time).getMonth() === monthIndex
        : false;

    // Filter WHO — berdasarkan jam sesi
    const hour = session?.date_time
      ? new Date(session.date_time).getHours()
      : null;
    const matchWho =
      !selected.who ||
      (selected.who === "Morning sesh hunter" && hour !== null && hour < 12) ||
      (selected.who === "Evening relief enthusiast" &&
        hour !== null &&
        hour >= 16) ||
      selected.who === "Both morning and evening sesh lover";

    // Filter ENJOY — berdasarkan lokasi
    const loc = e.location?.toLowerCase() ?? "";
    const matchEnjoy =
      !selected.enjoy ||
      (selected.enjoy === "A neat indoor flow" &&
        (loc.includes("studio") ||
          loc.includes("indoor") ||
          loc.includes("gym") ||
          loc.includes("mall"))) ||
      (selected.enjoy === "A fresh outdoor flow" &&
        (loc.includes("taman") ||
          loc.includes("park") ||
          loc.includes("outdoor") ||
          loc.includes("pantai") ||
          loc.includes("lapangan"))) ||
      selected.enjoy === "Any fun place to do my flow";

    // Filter GOAL — berdasarkan hari sesi
    const day = session?.date_time
      ? new Date(session.date_time).getDay()
      : null;
    const isWeekend = day === 0 || day === 6;
    const matchGoal =
      !selected.goal ||
      (selected.goal === "Unwind after a long weekday shift" &&
        day !== null &&
        !isWeekend) ||
      (selected.goal === "Make the most out of my weekend" &&
        day !== null &&
        isWeekend) ||
      selected.goal === "Embrace my day whenever I can";

    return matchSearch && matchMonth && matchWho && matchEnjoy && matchGoal;
  });

  return (
    <main
      style={{ paddingTop: "120px", minHeight: "100vh", background: "#F0EDE5" }}
    >
      {/* Modal Overlay */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(30, 30, 26, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px 24px",
              width: "100%",
              maxWidth: "900px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
              margin: "auto",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative", // ← tambah ini
            }}
          >
            {/* Tombol X */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "32px",
                height: "32px",
                borderRadius: "999px",
                border: "1.5px solid var(--border)",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
              }}
            >
              <X size={16} />
            </button>

            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                textAlign: "center",
                marginBottom: "28px",
              }}
            >
              Let us find the perfect flow for you
            </p>

            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "28px",
                marginBottom: "28px",
              }}
            >
              <div className="pref-grid">
                {Object.entries(preferences).map(([key, pref], idx) => (
                  <div
                    key={key}
                    style={{
                      borderLeft: idx > 0 ? "1px solid var(--border)" : "none",
                      paddingLeft: idx > 0 ? "24px" : "0",
                      paddingRight: idx < 2 ? "24px" : "0",
                    }}
                    className={`pref-col ${idx > 0 ? "pref-col-border" : ""}`}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        marginBottom: "16px",
                      }}
                    >
                      {pref.label}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                        alignItems: "flex-start",
                      }}
                    >
                      {pref.options.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => toggle(key, opt)}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            cursor: "pointer",
                            lineHeight: 1.5,
                          }}
                        >
                          <Checkbox
                            checked={selected[key] === opt}
                            onClick={() => toggle(key, opt)}
                          />
                          <span
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {opt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleFindFlow}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "8px",
                background: "var(--text-primary)",
                color: "var(--bg-cream)",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Find my flow
            </button>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px 80px" }}
        className="schedule-container"
      >
        {/* Header */}
        <div
          className="schedule-header"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "40px",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "280px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1.5px solid var(--text-primary)",
                borderRadius: "999px",
                padding: "12px 20px",
                background: "transparent",
                marginBottom: "20px",
              }}
            >
              <Search size={16} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder="Search a specific flow..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  width: "100%",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => setMonthIndex((m) => Math.max(0, m - 1))}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "999px",
                    border: "1.5px solid var(--text-primary)",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <div
                  style={{
                    padding: "8px 24px",
                    border: "1.5px solid var(--text-primary)",
                    borderLeft: "none",
                    borderRight: "none",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    minWidth: "100px",
                    textAlign: "center",
                  }}
                >
                  {months[monthIndex]}
                </div>
                <button
                  onClick={() => setMonthIndex((m) => Math.min(11, m + 1))}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "999px",
                    border: "1.5px solid var(--text-primary)",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div
                onClick={() => setShowAll(!showAll)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <Checkbox
                  checked={showAll}
                  onClick={() => setShowAll(!showAll)}
                />
                <span
                  style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                >
                  Show all schedule
                </span>
              </div>
            </div>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(36px, 5vw, 64px)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              textAlign: "right",
            }}
          >
            Find Your Flow!
          </h1>
        </div>

        {/* Cards */}
        {loadingEvents ? (
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            Loading events...
          </p>
        ) : filteredEvents.length === 0 ? (
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            No events available.
          </p>
        ) : (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="scroll-wrapper"
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "8px",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
            }}
          >
            <style>{`div::-webkit-scrollbar{display:none}`}</style>

            {filteredEvents.map((event) => {
              const session = event.sessions?.[0];
              const spotsRemaining =
                (session?.total_slots ?? 0) - (session?.booked_slots ?? 0);
              const totalSpots = session?.total_slots ?? 0;
              const dateStr = session?.date_time
                ? new Date(session.date_time).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "TBA";
              const timeStr = session?.date_time
                ? new Date(session.date_time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";
              const fillingUp = spotsRemaining > 0 && spotsRemaining <= 3;
              const showTag = event.tag || fillingUp;

              return (
                <div
                  key={event.id}
                  className="event-card"
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    maxHeight: "calc(100vh - 280px)",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: "relative",
                      height: "180px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        event.thumbnail_url ||
                        "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80"
                      }
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(4px)",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                      }}
                    >
                      {dateStr}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "12px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "white",
                          fontFamily: "var(--font-playfair)",
                          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                        }}
                      >
                        {event.title}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.9)",
                          textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                        }}
                      >
                        {timeStr}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      padding: "16px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      flex: 1,
                      overflowY: "auto",
                    }}
                  >
                    {/* Instructor */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {event.instructor_photo_url ? (
                        <img
                          src={event.instructor_photo_url}
                          alt={event.instructor_name}
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background: "#D4CFC6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                            flexShrink: 0,
                          }}
                        >
                          {event.instructor_name?.[0] ?? "?"}
                        </div>
                      )}
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                        }}
                      >
                        {event.instructor_name}
                      </p>
                    </div>

                    {/* Location + Level */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
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
                          {event.location}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <BarChart2 size={11} color="var(--text-secondary)" />
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {event.level || "All Levels"}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Price
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                        }}
                      >
                        {session?.price
                          ? `Rp ${session.price.toLocaleString("id-ID")}`
                          : "—"}
                      </span>
                    </div>

                    {/* Spots */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "5px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Spots remaining
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                          }}
                        >
                          {spotsRemaining} / {totalSpots}
                        </span>
                      </div>
                      <div
                        style={{
                          height: "4px",
                          background: "#E8E4DC",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: "999px",
                            background: showTag
                              ? "#E24B4A"
                              : "var(--text-primary)",
                            width:
                              totalSpots > 0
                                ? `${((totalSpots - spotsRemaining) / totalSpots) * 100}%`
                                : "0%",
                          }}
                        />
                      </div>
                      {showTag && (
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#E24B4A",
                            marginTop: "3px",
                            fontWeight: "500",
                          }}
                        >
                          {event.tag || "Filling up fast!"}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        lineHeight: "1.6",
                      }}
                    >
                      {event.description}
                    </p>

                    {/* Benefits */}
                    {event.benefits && event.benefits.length > 0 && (
                      <div>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                            marginBottom: "4px",
                          }}
                        >
                          Benefits:
                        </p>
                        <ul style={{ paddingLeft: "16px", margin: 0 }}>
                          {event.benefits.map((b: string, j: number) => (
                            <li
                              key={j}
                              style={{
                                fontSize: "11px",
                                color: "var(--text-secondary)",
                                lineHeight: "1.8",
                              }}
                            >
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Book Now */}
                    {userRole === "admin" ? (
                      <button
                        onClick={() => router.push("/admin/events")}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1.5px solid #5A5A55",
                          background: "transparent",
                          color: "#5A5A55",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                          marginTop: "auto",
                        }}
                      >
                        + Tambah Event
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push(`/book/${event.id}`)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#5A5A55",
                          color: "white",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                          marginTop: "auto",
                        }}
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Scroll controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => scrollByDir(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <ChevronLeft size={18} color="var(--text-secondary)" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={scrollProgress}
            onChange={handleSlider}
            style={{
              flex: 1,
              accentColor: "var(--text-primary)",
              cursor: "pointer",
            }}
          />
          <button
            onClick={() => scrollByDir(1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <ChevronRight size={18} color="var(--text-secondary)" />
          </button>
        </div>

        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            © 2026 flowszn. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .schedule-header { margin-top: 48px; }
        }
        @media (min-width: 640px) {
          .pref-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
            align-items: start;
          }
        }
        @media (max-width: 639px) {
          .pref-col { padding-left: 0 !important; padding-right: 0 !important; }
          .pref-col-border { border-left: none !important; border-top: 1px solid var(--border); padding-top: 20px !important; }
        }
        @media (max-width: 640px) {
          .event-card { min-width: calc(100vw - 80px) !important; max-width: calc(100vw - 80px) !important; }
        }
        @media (min-width: 641px) {
          .event-card { min-width: 320px !important; max-width: 320px !important; }
        }
      `}</style>
    </main>
  );
}
