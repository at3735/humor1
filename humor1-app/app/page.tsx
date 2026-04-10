"use client"
import { createBrowserClient } from '@supabase/ssr'

export default function Home() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f2eee5', paddingTop: '30vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '9vh' }}>
        <h1 style={{ fontWeight: 'bold', color: 'dark', fontSize: '3em', margin: '0' }}>Humor Project</h1>
        <h1 style={{ fontWeight: 'bold', color: 'dark', fontSize: '1.5em', margin: '0' }}>Caption Rating and Generating App</h1>
      </div>
      <p style={{ fontSize: '1em', marginBottom: '3vh' }}>Please sign in to proceed</p>
      <button
        onClick={handleLogin}
        style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#7499e0', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Sign in with Google
      </button>
    </div>
  )
}