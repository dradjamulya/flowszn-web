const testimonials = [
  {
    name: 'Raina',
    year: '2025',
    rating: 5,
    review: 'Flowszn has completely transformed my yoga journey! The instructor is incredibly supportive, and the event itself just breathes peace. It\'s my favorite part of the day.',
    avatar: '#C4A882'
  },
  {
    name: 'Sofia',
    year: '2025',
    rating: 5,
    review: 'I started yoga here to help with lower back pain, and it\'s been miraculous. The unique approach and beautiful community keep me coming back event after event.',
    avatar: '#A8B89C'
  }
]

export default function Testimonials() {
  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-cream)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>

        <h2 style={{
          fontFamily: 'var(--font-playfair)', fontSize: 'clamp(24px, 4vw, 36px)',
          color: 'var(--text-primary)', textAlign: 'center', marginBottom: '48px'
        }}>
          Stories from the community
        </h2>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} style={{
              background: i === 0 ? 'white' : '#E8E4DC',
              borderRadius: '24px', padding: '36px',
              display: 'flex', flexDirection: 'column', gap: '16px'
            }}>
              {/* Stars */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} style={{ color: '#FBBF24', fontSize: '18px' }}>★</span>
                ))}
              </div>

              {/* Review */}
              <p style={{
                fontSize: '14px', lineHeight: '1.8',
                color: 'var(--text-primary)', fontStyle: 'italic', flex: 1
              }}>
                "{t.review}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                {/* Avatar placeholder — swap dengan <img> saat foto asli ada */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: t.avatar, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: '600', color: 'white'
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{t.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          .testimonials-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }
          @media (min-width: 768px) {
            .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
          }
        `}</style>
      </div>
    </section>
  )
}