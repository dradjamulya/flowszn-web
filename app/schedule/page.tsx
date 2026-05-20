'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight, MapPin, BarChart2 } from 'lucide-react'

const events = [
  {
    title: 'Purple Flow',
    time: '08:00',
    date: 'May 29, 2026',
    instructor: 'Coach Fanny',
    instructorPhoto: null,
    location: 'ACC Unair',
    level: 'All Levels',
    spotsRemaining: 4,
    totalSpots: 12,
    tag: 'Filling up fast!',
    desc: "Get yourself relaxed in a purple themed flow to celebrate mother's day! Happy mother's day, Mothers!",
    benefits: ['ESQA Products', 'Teazzi', 'Kanalu', 'Shihlin (Mini special size)', 'Documentation', 'After movie'],
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80'
  },
  {
    title: 'Morning Vinyasa',
    time: '07:00',
    date: 'June 7, 2026',
    instructor: 'Coach Ayu',
    instructorPhoto: null,
    location: 'Taman Bungkul',
    level: 'Beginner',
    spotsRemaining: 8,
    totalSpots: 20,
    tag: null,
    desc: 'Start your morning with a gentle vinyasa flow surrounded by nature. Perfect for all levels.',
    benefits: ['Yoga mat rental', 'Healthy snacks', 'Documentation', 'E-certificate'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80'
  },
  {
    title: 'Sunset Flow',
    time: '17:30',
    date: 'June 14, 2026',
    instructor: 'Coach Rizky',
    instructorPhoto: null,
    location: 'Pantai Kenjeran',
    level: 'All Levels',
    spotsRemaining: 2,
    totalSpots: 15,
    tag: 'Filling up fast!',
    desc: 'Wind down with the golden hour. A flowing practice to release tension and connect with the environment.',
    benefits: ['Sunset view spot', 'Documentation', 'After movie', 'Healthy drinks'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'
  },
  {
    title: 'Evening Yin',
    time: '19:00',
    date: 'June 21, 2026',
    instructor: 'Coach Sara',
    instructorPhoto: null,
    location: 'Studio Flowszn',
    level: 'All Levels',
    spotsRemaining: 10,
    totalSpots: 12,
    tag: null,
    desc: 'Deep, slow-paced practice targeting connective tissues. Perfect for recovery and relaxation.',
    benefits: ['Mat provided', 'Aromatherapy', 'Documentation', 'Herbal tea'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80'
  }
]

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function SchedulePage() {
  const [monthIndex, setMonthIndex] = useState(4)
  const [search, setSearch] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const progress = el.scrollLeft / (el.scrollWidth - el.clientWidth)
    setScrollProgress(isNaN(progress) ? 0 : progress)
  }

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!scrollRef.current) return
    const val = parseFloat(e.target.value)
    const el = scrollRef.current
    el.scrollLeft = val * (el.scrollWidth - el.clientWidth)
    setScrollProgress(val)
  }

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.instructor.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', background: '#F0EDE5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px 80px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '40px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {/* Left: search + month */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              border: '1.5px solid var(--text-primary)', borderRadius: '999px',
              padding: '12px 20px', background: 'transparent', marginBottom: '20px'
            }}>
              <Search size={16} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder="Search a specific flow..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: '14px', color: 'var(--text-primary)', width: '100%'
                }}
              />
            </div>

            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              <button onClick={() => setMonthIndex(m => Math.max(0, m - 1))}
                style={{
                  width: '36px', height: '36px', borderRadius: '999px',
                  border: '1.5px solid var(--text-primary)', background: 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                <ChevronLeft size={16} />
              </button>
              <div style={{
                padding: '8px 24px', border: '1.5px solid var(--text-primary)',
                borderLeft: 'none', borderRight: 'none',
                fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)',
                minWidth: '100px', textAlign: 'center'
              }}>
                {months[monthIndex]}
              </div>
              <button onClick={() => setMonthIndex(m => Math.min(11, m + 1))}
                style={{
                  width: '36px', height: '36px', borderRadius: '999px',
                  border: '1.5px solid var(--text-primary)', background: 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: heading */}
          <h1 style={{
            fontFamily: 'var(--font-playfair)', fontSize: 'clamp(36px, 5vw, 64px)',
            color: 'var(--text-primary)', lineHeight: 1.1, textAlign: 'right'
          }}>
            Find Your Flow!
          </h1>
        </div>

        {/* Horizontal scroll cards */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: 'flex', gap: '20px', overflowX: 'auto',
            paddingBottom: '8px', scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
          }}
        >
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {filtered.map((event, i) => (
            <div key={i} style={{
              minWidth: '340px', maxWidth: '340px',
              background: 'white', borderRadius: '20px',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              flexShrink: 0
            }}>
              {/* Photo */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img src={event.image} alt={event.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {/* Date badge */}
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                  padding: '4px 10px', borderRadius: '6px',
                  fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)'
                }}>
                  {event.date}
                </div>
                {/* Title overlay */}
                <div style={{
                  position: 'absolute', bottom: '12px', left: '12px'
                }}>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: 'white',
                    fontFamily: 'var(--font-playfair)', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    {event.title}
                  </p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    {event.time}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {/* Instructor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: '#D4CFC6', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '14px', fontWeight: '600',
                    color: 'var(--text-primary)', flexShrink: 0
                  }}>
                    {event.instructor[6]}
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {event.instructor}
                  </p>
                </div>

                {/* Location + Level */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="var(--text-secondary)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{event.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BarChart2 size={12} color="var(--text-secondary)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{event.level}</span>
                  </div>
                </div>

                {/* Spots */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Spots remaining</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {event.spotsRemaining} / {event.totalSpots}
                    </span>
                  </div>
                  <div style={{ height: '4px', background: '#E8E4DC', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '999px',
                      background: event.spotsRemaining <= 3 ? '#E24B4A' : 'var(--text-primary)',
                      width: `${(event.spotsRemaining / event.totalSpots) * 100}%`
                    }} />
                  </div>
                  {event.tag && (
                    <p style={{ fontSize: '11px', color: '#E24B4A', marginTop: '4px', fontWeight: '500' }}>
                      {event.tag}
                    </p>
                  )}
                </div>

                {/* Description */}
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {event.desc}
                </p>

                {/* Benefits */}
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Benefits:
                  </p>
                  <ul style={{ paddingLeft: '16px', margin: 0 }}>
                    {event.benefits.map((b, j) => (
                      <li key={j} style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* Book button */}
                <button style={{
                  width: '100%', padding: '13px', borderRadius: '10px',
                  border: 'none', background: '#5A5A55',
                  color: 'white', fontSize: '14px', fontWeight: '500',
                  cursor: 'pointer', marginTop: 'auto'
                }}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom scroll slider */}
        <div style={{ marginTop: '24px', padding: '0 8px' }}>
          <input
            type="range" min="0" max="1" step="0.001"
            value={scrollProgress}
            onChange={handleSlider}
            style={{ width: '100%', accentColor: 'var(--text-primary)', cursor: 'pointer' }}
          />
        </div>

      </div>
    </main>
  )
}