import Link from 'next/link'
import BackButton from '@/components/layout/BackButton'
import { Flower2 } from 'lucide-react'

type ArchiveItem = {
  slug: string
  title: string
  description: string
  image?: string
  comingSoon?: boolean
}

const archiveItems: ArchiveItem[] = [
  {
    slug: 'sunrise-flow',
    title: 'Sunrise Flow',
    description:
      'Beginner friendly and the perfect way to unwind, breathe, and move under the city lights.',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80',
  },
  {
    slug: 'citylight-flow',
    title: 'Citylight Flow',
    description:
      'Beginner friendly and the perfect way to unwind, breathe, and move under the city lights.',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80',
  },
  {
    slug: 'rise-flow-vinyasa',
    title: 'Rise and Flow Vinyasa',
    description:
      'A different kind of flow, set inside of a car showroom. Move, breathe, and reset in a space where calm meets modern design!',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80',
  },
  {
    slug: 'iftar-flow',
    title: 'Iftar Flow',
    description:
      'A calm and mindful session designed to help you reconnect with your breath, release tension after a day of fasting, and prepare your body and mind before breaking the fast.',
    image:
      'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=900&q=80',
  },
  {
    slug: 'aligning-flow',
    title: 'Aligning the Flow',
    description:
      'Beginner friendly and the perfect way to unwind, breathe, and move under the city lights.',
    image:
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&q=80',
  },
  {
    slug: 'pink-flow',
    title: 'Pink Flow',
    description:
      'A different kind of flow, set inside of a car showroom. Move, breathe, and reset in a space where calm meets modern design!',
    image:
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=900&q=80',
  },
  {
    slug: 'sunset-hatha-flow',
    title: 'Sunset Hatha Flow',
    description:
      'Beginner friendly and the perfect way to unwind, breathe, and move under the city lights.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80',
  },
  {
    slug: 'matcha-zen-flow',
    title: 'Matcha Zen Flow',
    description:
      'A calm and mindful session designed to help you reconnect with your breath, release tension after a day of fasting, and prepare your body and mind before breaking the fast.',
    image:
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=80',
  },
  {
    slug: 'vinya-car-flow',
    title: 'Vinya-Car Flow',
    description:
      'A different kind of flow, set inside of a car showroom. Move, breathe, and reset in a space where calm meets modern design!',
    image:
      'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=900&q=80',
  },
  {
    slug: 'yoga-x-padel',
    title: 'Yoga x Padel',
    description:
      'Beginner friendly and the perfect way to unwind, breathe, and move under the city lights.',
    comingSoon: true,
  },
  {
    slug: 'yoga-x-padel-vol-02',
    title: 'Yoga x Padel vol. 02',
    description:
      'Beginner friendly and the perfect way to unwind, breathe, and move under the city lights.',
    comingSoon: true,
  },
]

export default function ArchivePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, #F8F5EE 0%, #EEEAE2 48%, #D8D6D0 100%)',
        color: '#1E1E1A',
        padding: '72px 24px 64px',
      }}
    >
      <BackButton href="/" />

      <div
        style={{
          width: '100%',
          maxWidth: '1180px',
          margin: '0 auto',
        }}
      >
        <header style={{ marginBottom: '42px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(40px, 6vw, 62px)',
              fontWeight: 400,
              lineHeight: 1,
              marginBottom: '18px',
              letterSpacing: '-0.02em',
            }}
          >
            Archive Gallery
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: '#8A8780',
              lineHeight: 1.6,
              marginBottom: '26px',
              maxWidth: '760px',
            }}
          >
            See through the highlights of our previous events and get a feel for
            the ambience you can expect!
          </p>

          <Flower2 size={28} color="#464642" strokeWidth={1.7} />
        </header>

        <section className="archive-grid">
          {archiveItems.map((item) => (
            <article
              key={item.slug}
              className="archive-card"
              style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                overflow: 'hidden',
                boxShadow: '0 22px 48px rgba(30, 30, 26, 0.10)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '215px',
                  overflow: 'hidden',
                  background: item.comingSoon
                    ? 'linear-gradient(135deg, #D8D5CE 0%, #F0EDE5 100%)'
                    : '#D8D5CE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.comingSoon ? (
                  <p
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '32px',
                      fontStyle: 'italic',
                      color: '#2D2D29',
                    }}
                  >
                    coming soon
                  </p>
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                )}
              </div>

              <div style={{ padding: '28px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '24px',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    marginBottom: '16px',
                    color: '#2D2D29',
                  }}
                >
                  {item.title}
                </h2>

                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.7,
                    color: '#8A8780',
                    minHeight: '74px',
                    marginBottom: '34px',
                  }}
                >
                  {item.description}
                </p>

                {item.comingSoon ? (
                  <button
                    type="button"
                    disabled
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '8px',
                      border: '2px solid #A6A39C',
                      background: 'transparent',
                      color: '#A6A39C',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'not-allowed',
                    }}
                  >
                    More
                  </button>
                ) : (
                  <Link
                    href={`/detailarchive?event=${item.slug}`}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '8px',
                      border: '2px solid #464642',
                      background: 'transparent',
                      color: '#464642',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    More
                  </Link>
                )}
              </div>
            </article>
          ))}
        </section>

        <footer
          style={{
            textAlign: 'center',
            marginTop: '112px',
            color: '#9A9790',
            fontSize: '11px',
          }}
        >
          © 2026 flowszn. All rights reserved.
        </footer>
      </div>

      <style>
        {`
          .archive-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 34px;
          }

          .archive-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .archive-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 28px 60px rgba(30, 30, 26, 0.16) !important;
          }

          @media (min-width: 768px) {
            main {
              padding: 82px 48px 72px !important;
            }

            .archive-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 38px 34px;
            }
          }

          @media (min-width: 1024px) {
            .archive-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 42px 34px;
            }
          }

          @media (max-width: 480px) {
            main {
              padding: 54px 18px 48px !important;
            }
          }
        `}
      </style>
    </main>
  )
}