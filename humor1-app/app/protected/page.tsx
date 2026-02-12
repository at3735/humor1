import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  // 1. Initialize Supabase with Async Cookies (Next.js 15 fix)
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // 2. THE GATE: Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/')
  }

  // 3. FETCH DATA: Get your captions from Assignment #2
  const { data: displayData, error: dbError } = await supabase
    .from('captions')
    .select('*')

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      {/* Header with User Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px', backgroundColor: '#fff', border: '2px solid #000' }}>
        <span>Logged in as: <strong>{user.email}</strong></span>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Back to Home</a>
      </div>

      <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>Humor Project - Gated UI</h1>
      <h2 style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>Captions Table (Protected)</h2>

      {/* Error Handling */}
      {dbError && (
        <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>
          Error fetching data: {dbError.message}
        </p>
      )}

      {/* Data Grid from Assignment #2 */}
      <div style={{ display: 'grid', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {displayData && displayData.map((row) => (
          <div
            key={row.id}
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxShadow: '4px 4px 0px #000' // Your brutalism style
            }}
          >
            <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '2px solid #eee', fontSize: '1.1rem', fontWeight: 'bold' }}>
              CONTENT: {row.content}
            </div>

            <div style={{ fontSize: '0.9rem', color: '#333', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div><strong>ID:</strong> {row.id}</div>
              <div><strong>Created (UTC):</strong> {row.created_datetime_utc}</div>
              <div><strong>Is Public:</strong> {row.is_public ? "True" : "False"}</div>
              <div><strong>Profile ID:</strong> {row.profile_id}</div>
              <div><strong>Like Count:</strong> {row.like_count}</div>
              <div><strong>Is Featured:</strong> {row.is_featured ? "True" : "False"}</div>
            </div>
          </div>
        ))}

        {displayData?.length === 0 && (
          <p style={{ textAlign: 'center' }}>No captions found in the database.</p>
        )}
      </div>
    </div>
  )
}