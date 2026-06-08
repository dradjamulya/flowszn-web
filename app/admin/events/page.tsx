"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  instructor_name: "",
  instructor_bio: "",
  thumbnail_url: "",
  status: "upcoming" as string,
  level: "All Levels" as string,
  tag: "",
  benefits: "",
  coming_soon: false,
  session_date: "",
  session_time: "",
  session_price: "",
  session_total_slots: "",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const supabase = createClient();

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreate = () => {
    setSelectedEvent(null);
    setForm(emptyForm);
    setThumbnailFile(null);
    setThumbnailPreview("");
    setDialogOpen(true);
  };

  const openEdit = async (event: any) => {
    setSelectedEvent(event);
    setThumbnailFile(null);
    setThumbnailPreview(event.thumbnail_url ?? "");

    const { data: sessions } = await supabase
      .from("sessions")
      .select("*")
      .eq("event_id", event.id)
      .limit(1);
    const session = sessions?.[0];

    setForm({
      title: event.title ?? "",
      description: event.description ?? "",
      location: event.location ?? "",
      instructor_name: event.instructor_name ?? "",
      instructor_bio: event.instructor_bio ?? "",
      thumbnail_url: event.thumbnail_url ?? "",
      status: event.status ?? "upcoming",
      level: event.level ?? "All Levels",
      tag: event.tag ?? "",
      benefits: Array.isArray(event.benefits) ? event.benefits.join(", ") : "",
      coming_soon: event.coming_soon ?? false,
      session_date: session?.date_time
        ? new Date(session.date_time).toISOString().split("T")[0]
        : "",
      session_time: session?.date_time
        ? new Date(session.date_time).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      session_price: session?.price?.toString() ?? "",
      session_total_slots: session?.total_slots?.toString() ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.location || !form.instructor_name) {
      alert("Judul, lokasi, dan nama instruktur wajib diisi.");
      return;
    }
    if (!selectedEvent && !thumbnailFile && !form.coming_soon) {
      alert("Thumbnail wajib diupload.");
      return;
    }

    if (form.session_date && !form.session_time) {
      alert("Jam sesi wajib diisi jika tanggal sudah dipilih.");
      setSaving(false);
      return;
    }

    setSaving(true);

    let thumbnailUrl = form.thumbnail_url;

    if (thumbnailFile) {
      const fileExt = thumbnailFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("event-thumbnails")
        .upload(fileName, thumbnailFile, { upsert: true });

      if (uploadError) {
        alert("Gagal upload thumbnail: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("event-thumbnails")
        .getPublicUrl(fileName);

      thumbnailUrl = urlData.publicUrl;
    }

    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      instructor_name: form.instructor_name,
      instructor_bio: form.instructor_bio,
      thumbnail_url: thumbnailUrl || null,
      status: form.coming_soon ? "coming_soon" : form.status,
      level: form.level,
      tag: form.tag || null,
      benefits: form.benefits
        ? form.benefits
            .split(",")
            .map((b: string) => b.trim())
            .filter(Boolean)
        : [],
      coming_soon: form.coming_soon,
    };

    let eventId = selectedEvent?.id;

    if (selectedEvent) {
      const { error: updateError } = await supabase
        .from("events")
        .update(payload)
        .eq("id", selectedEvent.id);
    } else {
      const { data: newEvent, error: insertError } = await supabase
        .from("events")
        .insert(payload)
        .select()
        .single();
      eventId = newEvent?.id;
    }

    // Insert/update session
    if (eventId && form.session_date && form.session_time) {
      const dateTime = new Date(
        `${form.session_date}T${form.session_time}:00`,
      ).toISOString();

      const { data: existingSessions, error: fetchErr } = await supabase
        .from("sessions")
        .select("id")
        .eq("event_id", eventId)
        .limit(1);

      if (existingSessions && existingSessions.length > 0) {
        const { error: updateSessionErr } = await supabase
          .from("sessions")
          .update({
            date_time: dateTime,
            price: Number(form.session_price) || 0,
            total_slots: Number(form.session_total_slots) || 0,
          })
          .eq("id", existingSessions[0].id);
      } else {
        const { error: insertSessionErr } = await supabase
          .from("sessions")
          .insert({
            event_id: eventId,
            date_time: dateTime,
            price: Number(form.session_price) || 0,
            total_slots: Number(form.session_total_slots) || 0,
            booked_slots: 0,
          });
      }
    } else {
      console.log("SKIP session — kondisi tidak terpenuhi:", {
        eventId,
        date: form.session_date,
        time: form.session_time,
      });
    }

    setSaving(false);
    setDialogOpen(false);
    fetchEvents();
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    // Hapus sessions dulu sebelum event
    await supabase.from("sessions").delete().eq("event_id", selectedEvent.id);
    await supabase.from("events").delete().eq("id", selectedEvent.id);
    setDeleteDialogOpen(false);
    fetchEvents();
  };

  const statusColor: Record<string, string> = {
    upcoming: "#F0F0F0",
    on_sale: "#DCF0E0",
    sold_out: "#FFE0E0",
    completed: "#E8E0F0",
    coming_soon: "#FFF3DC",
  };

  const statusTextColor: Record<string, string> = {
    upcoming: "#666",
    on_sale: "#2D7A3A",
    sold_out: "#A03030",
    completed: "#6040A0",
    coming_soon: "#A06010",
  };

  const inputStyle = {
    border: "1.5px solid #D0CCC4",
    borderRadius: "8px",
    marginTop: "6px",
    fontSize: "13px",
  };

  const CheckboxUI = ({
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
        border: "1.5px solid #D0CCC4",
        background: checked ? "var(--text-primary)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
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

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "28px",
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}
          >
            Kelola Events
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            {events.length} event terdaftar
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "8px",
            background: "var(--text-primary)",
            color: "white",
            border: "none",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={16} /> Tambah Event
        </button>
      </div>

      {/* Events List */}
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
      ) : events.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "60px",
            textAlign: "center",
            border: "1px solid var(--border)",
          }}
        >
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Belum ada event. Klik "Tambah Event" untuk mulai.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  flex: 1,
                  minWidth: "200px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "#E8E4DC",
                    border: "1px solid var(--border)",
                  }}
                >
                  {event.thumbnail_url && (
                    <img
                      src={event.thumbnail_url}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                      }}
                    >
                      {event.title}
                    </p>
                    {event.coming_soon && (
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: "#FFF3DC",
                          color: "#A06010",
                          fontWeight: "500",
                        }}
                      >
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginTop: "2px",
                    }}
                  >
                    {event.instructor_name} · {event.location}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    {event.level}
                  </p>
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "500",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    background: statusColor[event.status] ?? "#F0F0F0",
                    color: statusTextColor[event.status] ?? "#666",
                  }}
                >
                  {event.status}
                </span>
                <button
                  onClick={() => openEdit(event)}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    border: "1.5px solid #D0CCC4",
                    background: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Pencil size={14} color="var(--text-secondary)" />
                </button>
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setDeleteDialogOpen(true);
                  }}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    border: "1.5px solid #FFB0B0",
                    background: "#FFF5F5",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trash2 size={14} color="#A03030" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          style={{
            maxWidth: "600px",
            width: "92vw",
            maxHeight: "88vh",
            overflowY: "auto",
            padding: "32px",
            borderRadius: "16px",
            border: "1.5px solid #1C1C1A",
          }}
        >
          <DialogHeader style={{ marginBottom: "8px" }}>
            <DialogTitle
              style={{ fontFamily: "var(--font-playfair)", fontSize: "20px" }}
            >
              {selectedEvent ? "Edit Event" : "Tambah Event Baru"}
            </DialogTitle>
          </DialogHeader>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              paddingTop: "8px",
            }}
          >
            {/* Coming Soon Toggle */}
            <div
              onClick={() =>
                setForm({ ...form, coming_soon: !form.coming_soon })
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <CheckboxUI
                checked={form.coming_soon}
                onClick={() =>
                  setForm({ ...form, coming_soon: !form.coming_soon })
                }
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                Tandai sebagai Coming Soon
              </span>
            </div>

            {/* Thumbnail */}
            {!form.coming_soon && (
              <div>
                <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                  Thumbnail *
                </Label>
                <div style={{ marginTop: "8px" }}>
                  {thumbnailPreview && (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginBottom: "10px",
                        background: "#E8E4DC",
                        border: "1.5px solid #D0CCC4",
                      }}
                    >
                      <img
                        src={thumbnailPreview}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1.5px dashed #1C1C1A",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setThumbnailFile(file);
                          setThumbnailPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    📷{" "}
                    {thumbnailFile
                      ? thumbnailFile.name
                      : "Pilih foto thumbnail"}
                  </label>
                </div>
              </div>
            )}

            {/* Judul */}
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Judul Event *
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Morning Flow"
                style={inputStyle}
              />
            </div>

            {/* Deskripsi */}
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Deskripsi
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Deskripsi event..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {/* Lokasi */}
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Lokasi *
              </Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Taman Bungkul, Surabaya"
                style={inputStyle}
              />
            </div>

            {/* Instruktur + Level */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                  Nama Instruktur *
                </Label>
                <Input
                  value={form.instructor_name}
                  onChange={(e) =>
                    setForm({ ...form, instructor_name: e.target.value })
                  }
                  placeholder="Coach Ayu"
                  style={inputStyle}
                />
              </div>
              <div>
                <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                  Level
                </Label>
                <Select
                  value={form.level as string}
                  onValueChange={(val) =>
                    setForm({ ...form, level: val })
                  }
                >
                  <SelectTrigger style={{ ...inputStyle, width: "100%" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Levels">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bio Instruktur */}
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Bio Instruktur
              </Label>
              <Textarea
                value={form.instructor_bio}
                onChange={(e) =>
                  setForm({ ...form, instructor_bio: e.target.value })
                }
                placeholder="Bio singkat instruktur..."
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {/* Status + Tag */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                  Status
                </Label>
                <Select
                  value={form.status as string}
                  onValueChange={(val) =>
                    setForm({ ...form, status: val })
                  }
                >
                  <SelectTrigger style={{ ...inputStyle, width: "100%" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="on_sale">On Sale</SelectItem>
                    <SelectItem value="sold_out">Sold Out</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="coming_soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                  Tag{" "}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      fontWeight: "400",
                    }}
                  >
                    (opsional)
                  </span>
                </Label>
                <Input
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="Filling up fast!"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Benefits */}
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Benefits{" "}
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    fontWeight: "400",
                  }}
                >
                  (pisahkan dengan koma)
                </span>
              </Label>
              <Textarea
                value={form.benefits}
                onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                placeholder="Yoga mat, Healthy snacks, Documentation"
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {/* Jadwal Sesi */}
            <div
              style={{
                borderTop: "1px solid #E8E4DC",
                paddingTop: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                }}
              >
                Jadwal Sesi
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                    Tanggal
                  </Label>
                  <Input
                    type="date"
                    value={form.session_date}
                    onChange={(e) =>
                      setForm({ ...form, session_date: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                    Jam
                  </Label>
                  <Input
                    type="time"
                    value={form.session_time}
                    onChange={(e) =>
                      setForm({ ...form, session_time: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                    Harga (Rp)
                  </Label>
                  <Input
                    type="number"
                    value={form.session_price}
                    onChange={(e) =>
                      setForm({ ...form, session_price: e.target.value })
                    }
                    placeholder="150000"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                    Total Slots
                  </Label>
                  <Input
                    type="number"
                    value={form.session_total_slots}
                    onChange={(e) =>
                      setForm({ ...form, session_total_slots: e.target.value })
                    }
                    placeholder="30"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter style={{ marginTop: "28px", gap: "10px" }}>
            <button
              onClick={() => setDialogOpen(false)}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "1.5px solid #D0CCC4",
                background: "white",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                background: saving ? "#9A9A94" : "var(--text-primary)",
                color: "white",
                fontSize: "13px",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving
                ? "Menyimpan..."
                : selectedEvent
                  ? "Simpan Perubahan"
                  : "Tambah Event"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          style={{
            maxWidth: "400px",
            width: "90vw",
            padding: "32px",
            borderRadius: "16px",
            border: "1.5px solid #1C1C1A",
          }}
        >
          <DialogHeader style={{ marginBottom: "12px" }}>
            <DialogTitle
              style={{ fontFamily: "var(--font-playfair)", fontSize: "20px" }}
            >
              Hapus Event?
            </DialogTitle>
          </DialogHeader>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            Event{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {selectedEvent?.title}
            </strong>{" "}
            akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
          </p>
          <DialogFooter style={{ marginTop: "24px", gap: "10px" }}>
            <button
              onClick={() => setDeleteDialogOpen(false)}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "1.5px solid #D0CCC4",
                background: "white",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                background: "#A03030",
                color: "white",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
