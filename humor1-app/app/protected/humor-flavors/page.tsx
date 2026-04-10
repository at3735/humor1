import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HumorFlavorsPage() {
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

  // Fetch humor_flavors and their related humor_flavor_steps, ordered by 'order_by'
  const { data: flavors, error } = await supabase
    .from('humor_flavors')
    .select(`
      id,
      slug,
      description,
      humor_flavor_steps (
        *,
        humor_flavor_step_types(description),
        llm_input_types(name),
        llm_output_types(name),
        llm_models(name)
      )
    `)
    .order('order_by', { referencedTable: 'humor_flavor_steps', ascending: true });

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

      <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif', marginBottom: '30px' }}>Humor Flavors and Steps</h1>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error.message}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {flavors && flavors.map((flavor) => (
          <div key={flavor.id} style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '20px' }}>
            <h2 style={{ fontFamily: 'sans-serif', marginTop: 0 }}>{flavor.slug}</h2>
            <p>{flavor.description}</p>

            <h3 style={{ fontFamily: 'sans-serif', marginTop: '30px' }}>Steps:</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#eee', borderBottom: '2px solid #000' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Order</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Step Type</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Model</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>System Prompt</th>
                </tr>
              </thead>
              <tbody>
                {flavor.humor_flavor_steps.map((step: any) => (
                  <tr key={step.id} style={{ borderBottom: '1px solid #ccc' }}>
                    <td style={{ padding: '10px', verticalAlign: 'top' }}>{step.order_by}</td>
                    <td style={{ padding: '10px', verticalAlign: 'top' }}>{step.humor_flavor_step_types.description}</td>
                    <td style={{ padding: '10px', verticalAlign: 'top' }}>{step.llm_models.name}</td>
                    <td style={{ padding: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', verticalAlign: 'top' }}>{step.llm_system_prompt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {flavors?.length === 0 && <p style={{ textAlign: 'center' }}>No humor flavors found.</p>}
      </div>
    </div>
  )
}
