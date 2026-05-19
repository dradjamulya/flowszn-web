const testimonials = [
  {
    name: 'Raina',
    year: '2025',
    rating: 5,
    review: 'Flowszn has completely transformed my mornings. The instructors are incredibly supportive, and the space itself just breathes peace. It\'s my favorite part of the day.'
  },
  {
    name: 'Sofia',
    year: '2025',
    rating: 5,
    review: 'I started Yin Yoga here to help with lower back pain, and it\'s been miraculous. The gentle approach and beautiful community keep me coming back week after week.'
  }
]

export default function Testimonials() {
  return (
    <section style={{ padding: '64px 32px', background: 'var(--bg-cream)' }}>

      <h2 style={{
        fontFamily: 'var(--font-playfair)', fontSize: 'clamp(26px, 5vw, 38px)',
        color: 'var(--text-primary)', textAlign: 'center', marginBottom: '40px'
      }}>
        Stories from the community
      </h2>

      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <div key={i} style={{
            background: i === 0 ? 'white' : '#E8E4DC',
            borderRadius: '24px', padding: '32px',
            display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            {/* Stars */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(t.rating)].map((_, j) => (
                <span key={j} style={{ color: '#FBBF24', fontSize: '16px' }}>★</span>
              ))}
            </div>

            {/* Review */}
            <p style={{
              fontSize: '14px', lineHeight: '1.75',
              color: 'var(--text-primary)', fontStyle: 'italic', flex: 1
            }}>
              "{t.review}"
            </p>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: i === 0 ? '#C4A882' : '#A8B89C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: '600', color: 'white'
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
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  )
}