import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Waves, User } from 'lucide-react'

export default function Navbar() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
      {/* Navbar bar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 32px', background: '#464642',
        position: 'relative'
      }}>
        {/* Logo — posisi absolute di tengah wave */}
        <Link href="/" style={{
          position: 'absolute', left: '32px', top: '50%',
          transform: 'translateY(-10%)', zIndex: 10
        }}>
          <Image src="/LOGO FLOWSZN PUTIH.svg" alt="flowszn" width={72} height={72} className="rounded-full"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
        </Link>

        {/* Spacer kiri supaya nav links tidak tertimpa logo */}
        <div style={{ width: '72px' }} />

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#D4D0C8', textDecoration: 'none' }}>
            <Leaf size={14} /> theSZN
          </Link>
          <Link href="/schedule" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#D4D0C8', textDecoration: 'none' }}>
            <Waves size={14} /> Flow
          </Link>
          <Link href="/my-szn" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#D4D0C8', textDecoration: 'none' }}>
            <User size={14} /> mySZN
          </Link>
        </div>
      </nav>

      {/* Wave — logo float di tengahnya */}
      <div style={{ position: 'relative', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%' }}>
          {/* Gelombang gelap */}
          <path
            d="M0,0 C300,56 600,56 900,28 C1100,8 1300,0 1440,20 L1440,0 Z"
            fill="#464642"
          />
          {/* Sisa area cream */}
          <path
            d="M0,0 C300,56 600,56 900,28 C1100,8 1300,0 1440,20 L1440,56 L0,56 Z"
            fill="var(--bg-cream)"
          />
        </svg>

        {/* Logo float di atas wave */}
        <div style={{
          position: 'absolute', left: '32px', top: '-36px', zIndex: 20
        }}>
          <Image src="/LOGO FLOWSZN PUTIH.svg" alt="flowszn" width={72} height={72} className="rounded-full"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }} />
        </div>
      </div>
    </div>
  )
}