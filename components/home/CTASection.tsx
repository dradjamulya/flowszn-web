export default function CTASection() {
  return (
    <section style={{ padding: '80px 32px', background: 'var(--bg-cream)', textAlign: 'center' }}>
      <h2 style={{
        fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 5vw, 42px)',
        color: 'var(--text-primary)', marginBottom: '12px'
      }}>
        Begin Your Season Today
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Join our community!
      </p>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '12px',
        maxWidth: '420px', margin: '0 auto'
      }}
        className="cta-form">
        <input
          type="email"
          placeholder="Enter your email address"
          style={{
            padding: '14px 20px', borderRadius: '999px',
            border: '1px solid var(--border)', background: 'white',
            fontSize: '14px', color: 'var(--text-primary)',
            outline: 'none', flex: 1
          }}
        />
        <button style={{
          padding: '14px 32px', borderRadius: '999px',
          background: 'var(--text-primary)', color: 'var(--bg-cream)',
          border: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer'
        }}>
          Start Now
        </button>
      </div>

      <style>{`
        @media (min-width: 480px) {
          .cta-form {
            flex-direction: row !important;
          }
        }
      `}</style>
    </section>
  )
}