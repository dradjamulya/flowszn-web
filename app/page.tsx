import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: events, error } = await supabase
  .from('events')
  .select('*')

  console.log('events:', events)
  console.log('error:', error)

  return (
  <main style={{ background: 'white', color: 'black', padding: '20px' }}>
    <h1>flowszn</h1>
    <pre>{JSON.stringify(events, null, 2)}</pre>
  </main>
  )
}