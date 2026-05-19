export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-dark)', padding: '48px 32px 32px' }}>
      <div className="footer-grid">

        {/* Brand */}
        <div>
          <p style={{
            fontFamily: 'var(--font-playfair)', fontSize: '14px',
            color: '#9A9A8A', lineHeight: '1.7', maxWidth: '200px'
          }}>
            A sanctuary for mindful movement and deep restoration. Find your flow, find your season.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['About Us', 'Flow Schedule', 'Our Instructors', 'Booking', 'Contact'].map(link => (
            <a key={link} href="#" style={{ fontSize: '13px', color: '#9A9A8A', textDecoration: 'none' }}>
              {link}
            </a>
          ))}
        </div>

        {/* Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a href="#" style={{ fontSize: '13px', color: '#9A9A8A', textDecoration: 'none' }}>Instagram</a>
          <a href="tel:081234567890" style={{ fontSize: '13px', color: '#9A9A8A', textDecoration: 'none' }}>081234567890</a>
          <a href="mailto:flowszn@gmail.com" style={{ fontSize: '13px', color: '#9A9A8A', textDecoration: 'none' }}>flowszn@gmail.com</a>
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        borderTop: '1px solid #2A2A25', marginTop: '40px', paddingTop: '24px',
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
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr;
          }
        }
      `}</style>
    </footer>
  )
}