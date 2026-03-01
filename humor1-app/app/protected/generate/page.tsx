import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CaptionGenerator from '../CaptionGenerator' // Note the path change

export default async function GeneratePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/')
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <Link
          href="/protected"
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            color: '#000',
            backgroundColor: '#fff',
            border: '2px solid #000',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '2px 2px 0px #000',
          }}
        >
          &larr; Back to Menu
        </Link>
        <div style={{ backgroundColor: '#fff', padding: '10px 20px', border: '2px solid #000' }}>
          <span>Logged in as: <strong>{user.email}</strong></span>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <CaptionGenerator />
      </div>
    </div>
  )
}
