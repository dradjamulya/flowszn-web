'use client'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton({ href }: { href?: string }) {
  const router = useRouter()

  return (
    <button
      onClick={() => href ? router.push(href) : router.back()}
      style={{
        position: 'fixed', top: '32px', left: '32px', zIndex: 100,
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', padding: 0
      }}>
      <ArrowLeft size={22} color="var(--text-secondary)" />
    </button>
  )
}