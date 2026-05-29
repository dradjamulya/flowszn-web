import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Geist } from 'next/font/google'
import AppShell from '@/components/layout/AppShell'
import Footer from '@/components/layout/Footer'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'flowszn — Find Your Flow, Find Your Season',
  description: 'Open-space yoga community di Surabaya',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={cn("font-sans", geist.variable)}>
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}