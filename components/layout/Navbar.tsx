'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, Waves, User } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  const linkStyle = (href: string) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '14px', textDecoration: 'none',
    fontWeight: pathname === href ? '600' : '400',
    color: pathname === href ? '#232321' : '#D4D0C8',
  })

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 32px', background: '#464642', position: 'relative',
      }}>
        <div style={{ width: '72px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/" style={linkStyle('/')}>
            <Leaf size={14} /> theSZN
          </Link>
          <Link href="/schedule" style={linkStyle('/schedule')}>
            <Waves size={14} /> Flow
          </Link>
          <Link href="/login" style={linkStyle('/login')}>
            <User size={14} /> mySZN
          </Link>
        </div>
      </nav>

      <div style={{ position: 'relative', lineHeight: 0 }}>
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%' }}>
          <path d="M0,0 C300,56 600,56 900,28 C1100,8 1300,0 1440,20 L1440,0 Z" fill="#464642" />
          <path d="M0,0 C300,56 600,56 900,28 C1100,8 1300,0 1440,20 L1440,56 L0,56 Z" fill="var(--bg-cream)" />
        </svg>

        <Link href="/" style={{ position: 'absolute', left: '32px', top: '-36px', zIndex: 20 }}>
          <Image src="/LOGO FLOWSZN PUTIH.svg" alt="flowszn" width={72} height={72}
            className="rounded-full"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }} />
        </Link>
      </div>
    </div>
  )
}