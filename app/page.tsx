import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import WhyFlowszn from '@/components/home/WhyFlowszn';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import Testimonials from '@/components/home/Testimonial';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <main style={{ paddingTop: '120px', background: 'var(--bg-cream)' }}>
      <HeroSection />
      <WhyFlowszn />
      <UpcomingEvents />
      <Testimonials />
      <CTASection />
    </main>
  )
}