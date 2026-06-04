"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminArchivePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [galleryMap, setGalleryMap] = useState<Record<string, any[]>>({});
  const [testimonialMap, setTestimonialMap] = useState<Record<string, any[]>>(
    {},
  );

  // Dialog gallery
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [galleryEventId, setGalleryEventId] = useState<string>("");
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [savingGallery, setSavingGallery] = useState(false);

  // Dialog testimoni
  const [testiDialogOpen, setTestiDialogOpen] = useState(false);
  const [testiEventId, setTestiEventId] = useState<string>("");
  const [testiForm, setTestiForm] = useState({
    name: "",
    review_text: "",
    rating: "5",
    avatar_url: "",
  });
  const [savingTesti, setSavingTesti] = useState(false);

  const supabase = createClient();

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("id, title, thumbnail_url, location, created_at")
      .eq("status", "completed")
      .order("created_at", { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  const fetchGallery = async (eventId: string) => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .eq("event_id", eventId)
      .order("order", { ascending: true });
    setGalleryMap((prev) => ({ ...prev, [eventId]: data ?? [] }));
  };

  const fetchTestimonials = async (eventId: string) => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
    setTestimonialMap((prev) => ({ ...prev, [eventId]: data ?? [] }));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const toggleExpand = (eventId: string) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
      fetchGallery(eventId);
      fetchTestimonials(eventId);
    }
  };

  const openGalleryDialog = (eventId: string) => {
    setGalleryEventId(eventId);
    setGalleryFile(null);
    setGalleryCaption("");
    setGalleryDialogOpen(true);
  };

  const handleSaveGallery = async () => {
    if (!galleryFile) {
      alert("Pilih foto terlebih dahulu.");
      return;
    }
    setSavingGallery(true);

    const fileExt = galleryFile.name.split(".").pop();
    const fileName = `gallery/${galleryEventId}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("event-thumbnails")
      .upload(fileName, galleryFile, { upsert: true });

    if (uploadError) {
      alert("Gagal upload foto: " + uploadError.message);
      setSavingGallery(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("event-thumbnails")
      .getPublicUrl(fileName);

    const currentGallery = galleryMap[galleryEventId] ?? [];
    await supabase.from("gallery").insert({
      event_id: galleryEventId,
      photo_url: urlData.publicUrl,
      caption: galleryCaption || null,
      order: currentGallery.length + 1,
    });

    setSavingGallery(false);
    setGalleryDialogOpen(false);
    fetchGallery(galleryEventId);
  };

  const handleDeleteGallery = async (galleryId: string, eventId: string) => {
    if (!confirm("Hapus foto ini?")) return;
    await supabase.from("gallery").delete().eq("id", galleryId);
    fetchGallery(eventId);
  };

  const openTestiDialog = (eventId: string) => {
    setTestiEventId(eventId);
    setTestiForm({ name: "", review_text: "", rating: "5", avatar_url: "" });
    setTestiDialogOpen(true);
  };

  const handleSaveTesti = async () => {
    if (!testiForm.name || !testiForm.review_text) {
      alert("Nama dan review wajib diisi.");
      return;
    }
    setSavingTesti(true);
    await supabase.from("testimonials").insert({
      event_id: testiEventId,
      name: testiForm.name,
      review_text: testiForm.review_text,
      rating: Number(testiForm.rating),
      avatar_url: testiForm.avatar_url || null,
    });
    setSavingTesti(false);
    setTestiDialogOpen(false);
    fetchTestimonials(testiEventId);
  };

  const handleDeleteTesti = async (testiId: string, eventId: string) => {
    if (!confirm("Hapus testimoni ini?")) return;
    await supabase.from("testimonials").delete().eq("id", testiId);
    fetchTestimonials(eventId);
  };

  const inputStyle = {
    border: "1.5px solid #D0CCC4",
    borderRadius: "8px",
    marginTop: "6px",
    fontSize: "13px",
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "28px",
            color: "var(--text-primary)",
            marginBottom: "4px",
          }}
        >
          Kelola Archive
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          Tambah foto gallery dan testimoni untuk event yang sudah selesai
        </p>
      </div>

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
            Belum ada event completed. Ubah status event ke "completed" di
            halaman Kelola Events.
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
                border: "1px solid var(--border)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}
            >
              {/* Event Header */}
              <div
                onClick={() => toggleExpand(event.id)}
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "#E8E4DC",
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
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                      }}
                    >
                      {event.title}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginTop: "2px",
                      }}
                    >
                      {event.location}
                    </p>
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      background: "#E8E0F0",
                      color: "#6040A0",
                      fontWeight: "500",
                    }}
                  >
                    completed
                  </span>
                  {expandedEvent === event.id ? (
                    <ChevronUp size={16} color="var(--text-secondary)" />
                  ) : (
                    <ChevronDown size={16} color="var(--text-secondary)" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedEvent === event.id && (
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {/* Gallery Section */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                        }}
                      >
                        Gallery ({galleryMap[event.id]?.length ?? 0} foto)
                      </p>
                      <button
                        onClick={() => openGalleryDialog(event.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "7px 14px",
                          borderRadius: "8px",
                          background: "var(--text-primary)",
                          color: "white",
                          border: "none",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={13} /> Tambah Foto
                      </button>
                    </div>

                    {galleryMap[event.id]?.length === 0 ? (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          fontStyle: "italic",
                        }}
                      >
                        Belum ada foto gallery.
                      </p>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(140px, 1fr))",
                          gap: "10px",
                        }}
                      >
                        {galleryMap[event.id]?.map((photo) => (
                          <div
                            key={photo.id}
                            style={{
                              position: "relative",
                              borderRadius: "8px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={photo.photo_url}
                              alt={photo.caption ?? ""}
                              style={{
                                width: "100%",
                                aspectRatio: "1",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                            {photo.caption && (
                              <p
                                style={{
                                  fontSize: "10px",
                                  color: "var(--text-secondary)",
                                  padding: "4px 6px",
                                  background: "white",
                                }}
                              >
                                {photo.caption}
                              </p>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteGallery(photo.id, event.id)
                              }
                              style={{
                                position: "absolute",
                                top: "6px",
                                right: "6px",
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                background: "#A03030",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Trash2 size={11} color="white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Testimonials Section */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                        }}
                      >
                        Testimoni ({testimonialMap[event.id]?.length ?? 0})
                      </p>
                      <button
                        onClick={() => openTestiDialog(event.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "7px 14px",
                          borderRadius: "8px",
                          background: "var(--text-primary)",
                          color: "white",
                          border: "none",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={13} /> Tambah Testimoni
                      </button>
                    </div>

                    {testimonialMap[event.id]?.length === 0 ? (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          fontStyle: "italic",
                        }}
                      >
                        Belum ada testimoni.
                      </p>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {testimonialMap[event.id]?.map((testi) => (
                          <div
                            key={testi.id}
                            style={{
                              background: "#F8F5EE",
                              borderRadius: "10px",
                              padding: "12px 16px",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                flexShrink: 0,
                                background: "#D4CFC6",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                              }}
                            >
                              {testi.avatar_url ? (
                                <img
                                  src={testi.avatar_url}
                                  alt={testi.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                testi.name?.[0]
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  marginBottom: "4px",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "var(--text-primary)",
                                  }}
                                >
                                  {testi.name}
                                </p>
                                <div style={{ display: "flex", gap: "2px" }}>
                                  {[...Array(testi.rating ?? 5)].map((_, i) => (
                                    <span
                                      key={i}
                                      style={{
                                        color: "#FBBF24",
                                        fontSize: "11px",
                                      }}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <p
                                style={{
                                  fontSize: "12px",
                                  color: "var(--text-secondary)",
                                  lineHeight: 1.5,
                                }}
                              >
                                {testi.review_text}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteTesti(testi.id, event.id)
                              }
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "6px",
                                background: "#FFF5F5",
                                border: "1px solid #FFB0B0",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Trash2 size={11} color="#A03030" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialog Tambah Foto */}
      <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
        <DialogContent
          style={{
            maxWidth: "480px",
            width: "92vw",
            padding: "32px",
            borderRadius: "16px",
            border: "1.5px solid #1C1C1A",
          }}
        >
          <DialogHeader style={{ marginBottom: "16px" }}>
            <DialogTitle
              style={{ fontFamily: "var(--font-playfair)", fontSize: "20px" }}
            >
              Tambah Foto Gallery
            </DialogTitle>
          </DialogHeader>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Foto *
              </Label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginTop: "6px",
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
                  onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                />
                📷 {galleryFile ? galleryFile.name : "Pilih foto"}
              </label>
            </div>
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Caption{" "}
                <span
                  style={{
                    fontWeight: "400",
                    color: "var(--text-secondary)",
                    fontSize: "11px",
                  }}
                >
                  (opsional)
                </span>
              </Label>
              <Input
                value={galleryCaption}
                onChange={(e) => setGalleryCaption(e.target.value)}
                placeholder="Deskripsi foto..."
                style={inputStyle}
              />
            </div>
          </div>
          <DialogFooter style={{ marginTop: "24px", gap: "10px" }}>
            <button
              onClick={() => setGalleryDialogOpen(false)}
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
              onClick={handleSaveGallery}
              disabled={savingGallery}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                background: savingGallery ? "#9A9A94" : "var(--text-primary)",
                color: "white",
                fontSize: "13px",
                fontWeight: "600",
                cursor: savingGallery ? "not-allowed" : "pointer",
              }}
            >
              {savingGallery ? "Mengupload..." : "Simpan"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Tambah Testimoni */}
      <Dialog open={testiDialogOpen} onOpenChange={setTestiDialogOpen}>
        <DialogContent
          style={{
            maxWidth: "480px",
            width: "92vw",
            padding: "32px",
            borderRadius: "16px",
            border: "1.5px solid #1C1C1A",
          }}
        >
          <DialogHeader style={{ marginBottom: "16px" }}>
            <DialogTitle
              style={{ fontFamily: "var(--font-playfair)", fontSize: "20px" }}
            >
              Tambah Testimoni
            </DialogTitle>
          </DialogHeader>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Nama *
              </Label>
              <Input
                value={testiForm.name}
                onChange={(e) =>
                  setTestiForm({ ...testiForm, name: e.target.value })
                }
                placeholder="Nama user"
                style={inputStyle}
              />
            </div>
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Review *
              </Label>
              <Textarea
                value={testiForm.review_text}
                onChange={(e) =>
                  setTestiForm({ ...testiForm, review_text: e.target.value })
                }
                placeholder="Tulis review..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Rating
              </Label>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() =>
                      setTestiForm({ ...testiForm, rating: String(r) })
                    }
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      border:
                        testiForm.rating === String(r)
                          ? "2px solid var(--text-primary)"
                          : "1.5px solid #D0CCC4",
                      background:
                        testiForm.rating === String(r)
                          ? "var(--text-primary)"
                          : "white",
                      color:
                        testiForm.rating === String(r)
                          ? "white"
                          : "var(--text-secondary)",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label style={{ fontSize: "13px", fontWeight: "600" }}>
                Avatar URL{" "}
                <span
                  style={{
                    fontWeight: "400",
                    color: "var(--text-secondary)",
                    fontSize: "11px",
                  }}
                >
                  (opsional)
                </span>
              </Label>
              <Input
                value={testiForm.avatar_url}
                onChange={(e) =>
                  setTestiForm({ ...testiForm, avatar_url: e.target.value })
                }
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
          </div>
          <DialogFooter style={{ marginTop: "24px", gap: "10px" }}>
            <button
              onClick={() => setTestiDialogOpen(false)}
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
              onClick={handleSaveTesti}
              disabled={savingTesti}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                background: savingTesti ? "#9A9A94" : "var(--text-primary)",
                color: "white",
                fontSize: "13px",
                fontWeight: "600",
                cursor: savingTesti ? "not-allowed" : "pointer",
              }}
            >
              {savingTesti ? "Menyimpan..." : "Simpan"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
