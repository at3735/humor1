import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Main navigation page for authenticated users.
export default async function ProtectedPage() {
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
    <div style={{
      padding: '40px',
      fontFamily: 'monospace',
      backgroundColor: '#f4f4f4',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: '#fff',
        padding: '10px 20px',
        border: '2px solid #000'
      }}>
        <span>Logged in as: <strong>{user.email}</strong></span>
      </div>

      <h1 style={{ fontFamily: 'sans-serif', marginBottom: '40px' }}>What would you like to do?</h1>

      <div style={{ display: 'flex', gap: '20px' }}>
        <Link href="/protected/rate" style={{
          padding: '20px 40px',
          fontSize: '1.2rem',
          color: '#fff',
          backgroundColor: '#0070f3',
          border: '2px solid #000',
          boxShadow: '4px 4px 0px #000',
          textDecoration: 'none',
          textAlign: 'center',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease'
        }}>
          Rate Captions
        </Link>

        <Link href="/protected/generate" style={{
          padding: '20px 40px',
          fontSize: '1.2rem',
          color: '#fff',
          backgroundColor: '#4CAF50',
          border: '2px solid #000',
          boxShadow: '4px 4px 0px #000',
          textDecoration: 'none',
          textAlign: 'center',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease'
        }}>
          Generate Captions
        </Link>
      </div>
    </div>
  )
}
