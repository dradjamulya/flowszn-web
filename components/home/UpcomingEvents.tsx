const events = [
  {
    title: 'Vinyasa Flow',
    duration: '60 Min',
    badge: 'All Levels',
    desc: 'A dynamic, fluid practice connecting breath with movement. Build heat, strength, and flexibility while clearing the mind.',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80'
  },
  {
    title: 'Iftar Flow',
    duration: '75 Min',
    badge: 'Beginner Friendly',
    desc: 'Slow-paced style holding postures for longer periods. Targets deep connective tissues, increasing circulation and flexibility.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80'
  },
  {
    title: 'Car Flow',
    duration: '45 Min',
    badge: 'All Levels',
    desc: 'Start your day with clarity. Guided mindfulness practices and gentle seated stretches to awaken the body and center the mind.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'
  }
]

export default function UpcomingEvents() {
  return (
    <section style={{ padding: '64px 32px', background: 'var(--bg-cream)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair)', fontSize: 'clamp(26px, 5vw, 38px)',
          color: 'var(--text-primary)', maxWidth: '260px', lineHeight: '1.2'
        }}>
          Upcoming Events
        </h2>
        <a href="/schedule" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', whiteSpace: 'nowrap', marginTop: '8px' }}>
          View Full Schedule →
        </a>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
        Discover our most next sessions designed to help you exactly feel your inner season
      </p>

      {/* Cards */}
      <div className="events-grid">
        {events.map((event, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '20px',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            {/* Image */}
            <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
              <img
                src={event.image}
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Badge */}
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                padding: '4px 10px', borderRadius: '999px', fontSize: '11px',
                fontWeight: '500', color: 'var(--text-primary)'
              }}>
                {event.badge}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{
                  fontFamily: 'var(--font-playfair)', fontSize: '18px',
                  color: 'var(--text-primary)', fontWeight: '600'
                }}>
                  {event.title}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{event.duration}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1 }}>
                {event.desc}
              </p>
              <button style={{
                width: '100%', padding: '12px', borderRadius: '999px',
                border: '1.5px solid var(--text-primary)', background: 'transparent',
                fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)',
                cursor: 'pointer', marginTop: '8px'
              }}>
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .events-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .events-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  )
}