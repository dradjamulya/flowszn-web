export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-dark)', padding: '56px 0 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>

        <div className="footer-grid">
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{
              fontFamily: 'var(--font-playfair)', fontSize: '13px',
              color: '#9A9A8A', lineHeight: '1.7', maxWidth: '200px'
            }}>
              Find your flow, feel your season.
            </p>
            {/* Instagram icon */}
            <a href="https://instagram.com/flowszn" target="_blank" rel="noreferrer"
              style={{ color: '#9A9A8A', display: 'inline-flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {['About Us', 'Flow Schedule', 'Our Instructors', 'Booking', 'Contact'].map(link => (
              <a key={link} href="#" style={{ fontSize: '13px', color: '#9A9A8A', textDecoration: 'none' }}>
                {link}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <a href="https://instagram.com/flowszn" target="_blank" rel="noreferrer"
              style={{ fontSize: '13px', color: '#9A9A8A', textDecoration: 'none' }}>
              @flowszn
            </a>
            <a href="tel:081234567890" style={{ fontSize: '13px', color: '#9A9A8A', textDecoration: 'none' }}>
              081234567890
            </a>
            <a href="mailto:flowszn@gmail.com" style={{ fontSize: '13px', color: '#9A9A8A', textDecoration: 'none' }}>
              flowszn@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #2A2A25', marginTop: '48px', paddingTop: '24px',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px'
        }}>
          <p style={{ fontSize: '12px', color: '#6B6B60' }}>© 2026 flowszn. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Privacy Policy', 'Terms of Service'].map(item => (
              <a key={item} href="#" style={{ fontSize: '12px', color: '#6B6B60', textDecoration: 'none' }}>{item}</a>
            ))}
          </div>
        </div>

        <style>{`
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
          }
          @media (min-width: 768px) {
            .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
          }
        `}</style>
      </div>
    </footer>
  )
}