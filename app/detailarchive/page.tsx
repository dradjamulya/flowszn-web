import BackButton from '@/components/layout/BackButton'
import { ArrowRight } from 'lucide-react'

type DetailArchive = {
  title: string
  description: string
  participants: number
  reviewText: string
  avatar: string
  images: string[]
}

const detailArchives: Record<string, DetailArchive> = {
  'sunrise-flow': {
    title: 'Sunrise Flow',
    description:
      'Beginner friendly and the perfect way to unwind, breathe, and move under the city lights.',
    participants: 24,
    reviewText:
      'morning sessionnya peaceful banget, cocok buat mulai hari dengan badan dan pikiran yang lebih fresh.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    images: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
      'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1200&q=80',
    ],
  },
  'citylight-flow': {
    title: 'Citylight Flow',
    description:
      'Beginner friendly and the perfect way to unwind, breathe, and move under the city lights.',
    participants: 28,
    reviewText:
      'ambience malamnya enak banget, calming dan bikin lebih relax setelah aktivitas seharian.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=80',
    ],
  },
  'rise-flow-vinyasa': {
    title: 'Rise and Flow Vinyasa',
    description:
      'A different kind of flow, set inside of a car showroom. Move, breathe, and reset in a space where calm meets modern design!',
    participants: 32,
    reviewText:
      'kelasnya seru dan energizing, flow-nya tetap beginner friendly tapi terasa menantang.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=80',
      'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=1200&q=80',
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&q=80',
    ],
  },
  'iftar-flow': {
    title: 'Iftar Flow',
    description:
      'A calm and mindful session designed to help you reconnect with your breath, release tension after a day of fasting, and prepare your body and mind before breaking the fast.',
    participants: 26,
    reviewText:
      'flow sebelum buka puasa rasanya tenang banget, gerakannya pas dan tidak terlalu berat.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    images: [
      'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1200&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
    ],
  },
  'aligning-flow': {
    title: 'Aligning the Flow',
    description:
      'Beginner friendly and the perfect way to unwind, breathe, and move under the city lights.',
    participants: 22,
    reviewText:
      'sessionnya mindful banget, cocok buat release tension dan belajar alignment yang benar.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    images: [
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&q=80',
    ],
  },
  'pink-flow': {
    title: 'Pink Flow',
    description:
      'A different kind of flow, set inside of a car showroom. Move, breathe, and reset in a space where calm meets modern design!',
    participants: 35,
    reviewText:
      'vibes pink flow lucu banget, tempatnya nyaman dan eventnya terasa warm.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    images: [
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
    ],
  },
  'sunset-hatha-flow': {
    title: 'Sunset Hatha Flow',
    description:
      'Beginner friendly and the perfect way to unwind, breathe, and move under the city lights.',
    participants: 30,
    reviewText:
      'sunset vibesnya cantik, gerakannya slow tapi tetap bikin badan lebih ringan.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
    ],
  },
  'matcha-zen-flow': {
    title: 'Matcha Zen Flow',
    description:
      'A calm and mindful session designed to help you reconnect with your breath, release tension after a day of fasting, and prepare your body and mind before breaking the fast.',
    participants: 27,
    reviewText:
      'matcha zen flow calming banget, suka konsepnya karena terasa intimate dan refreshing.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    images: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80',
      'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1200&q=80',
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
    ],
  },
  'vinya-car-flow': {
    title: 'Vinya-Car Flow',
    description:
      'A different kind of flow, set inside of a car showroom. Move, breathe, and reset in a space where calm meets modern design!',
    participants: 30,
    reviewText:
      'seru banget!! super fresh, unik, worth it dan bakalan ikut next event sih hahaha',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    images: [
      'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=1200&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=80',
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&q=80',
    ],
  },
}

export default async function DetailArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>
}) {
  const { event } = await searchParams
  const selectedEvent = event ?? 'vinya-car-flow'
  const archive = detailArchives[selectedEvent] ?? detailArchives['vinya-car-flow']

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, #F8F5EE 0%, #EEEAE2 48%, #D8D6D0 100%)',
        color: '#1E1E1A',
        padding: '74px 24px 56px',
      }}
    >
      <BackButton href="/archive" />

      <div
        style={{
          width: '100%',
          maxWidth: '1180px',
          margin: '0 auto',
        }}
      >
        <header style={{ marginBottom: '30px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(42px, 6vw, 62px)',
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              marginBottom: '18px',
            }}
          >
            {archive.title}
          </h1>

          <p
            style={{
              fontSize: '17px',
              color: '#77746D',
              lineHeight: 1.6,
              maxWidth: '1000px',
            }}
          >
            {archive.description}
          </p>
        </header>

        <section
          className="archive-info-bar"
          style={{
            width: '100%',
            minHeight: '96px',
            background: '#464642',
            border: '12px solid #7A7770',
            borderRadius: '16px',
            display: 'grid',
            gridTemplateColumns: '280px 1fr 64px',
            overflow: 'hidden',
            marginBottom: '34px',
          }}
        >
          <div
            style={{
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              borderRight: '12px solid #7A7770',
              color: '#F3EEE5',
            }}
          >
            <span
              style={{
                fontSize: '54px',
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '0.02em',
              }}
            >
              {archive.participants}
            </span>

            <span
              style={{
                fontSize: '15px',
                color: '#E7E2DA',
              }}
            >
              flowies <i>participated</i>
            </span>
          </div>

          <div
            style={{
              padding: '18px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              color: '#F3EEE5',
            }}
          >
            <img
              src={archive.avatar}
              alt="Flowies testimonial"
              style={{
                width: '62px',
                height: '62px',
                borderRadius: '999px',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />

            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: '#F3EEE5',
              }}
            >
              {archive.reviewText}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F3EEE5',
            }}
          >
            <ArrowRight size={28} />
          </div>
        </section>

        <section className="detail-gallery">
          <div className="gallery-left">
            <img
              src={archive.images[0]}
              alt={`${archive.title} documentation 1`}
              className="gallery-large"
            />

            <div className="gallery-bottom">
              <img
                src={archive.images[2]}
                alt={`${archive.title} documentation 3`}
              />
              <img
                src={archive.images[3]}
                alt={`${archive.title} documentation 4`}
              />
            </div>
          </div>

          <img
            src={archive.images[1]}
            alt={`${archive.title} documentation 2`}
            className="gallery-tall"
          />
        </section>

        <footer
          style={{
            textAlign: 'center',
            marginTop: '96px',
            color: '#9A9790',
            fontSize: '12px',
          }}
        >
          © 2026 flowszn. All rights reserved.
        </footer>
      </div>

      <style>
        {`
          .detail-gallery {
            display: grid;
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .gallery-left {
            display: grid;
            gap: 28px;
          }

          .gallery-large {
            width: 100%;
            height: 430px;
            object-fit: cover;
            border-radius: 16px;
            display: block;
          }

          .gallery-bottom {
            display: grid;
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .gallery-bottom img {
            width: 100%;
            height: 220px;
            object-fit: cover;
            border-radius: 16px;
            display: block;
          }

          .gallery-tall {
            width: 100%;
            height: 680px;
            object-fit: cover;
            border-radius: 16px;
            display: block;
          }

          @media (min-width: 900px) {
            .detail-gallery {
              grid-template-columns: 2fr 1.05fr;
              gap: 28px;
              align-items: stretch;
            }

            .gallery-large {
              height: 390px;
            }

            .gallery-bottom {
              grid-template-columns: 1fr 1fr;
            }

            .gallery-bottom img {
              height: 220px;
            }

            .gallery-tall {
              height: 638px;
            }
          }

          @media (max-width: 767px) {
            main {
              padding: 64px 18px 48px !important;
            }

            .archive-info-bar {
              grid-template-columns: 1fr !important;
              border-width: 8px !important;
            }

            .archive-info-bar > div {
              border-right: none !important;
              border-bottom: 8px solid #7A7770;
            }

            .archive-info-bar > div:last-child {
              border-bottom: none !important;
              padding: 18px;
            }

            .gallery-large,
            .gallery-tall,
            .gallery-bottom img {
              height: 260px !important;
            }
          }
        `}
      </style>
    </main>
  )
}