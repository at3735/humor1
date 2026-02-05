"use client"

import { supabase } from '../utils/supabase'

export default function TestPage() {
  // ADD THIS LOG HERE:
  console.log("Supabase Client initialized:", supabase);

  const handleTest = async () => {
    console.log('Button clicked, attempting fetch...');
    try {
      const { data, error } = await supabase.from('captions').select('*').limit(1)
      console.log('Fetch attempt finished');

      if (error) {
        console.log('Supabase Error:', error.message)
      } else {
        console.log('Data found:', data)
      }
    } catch (err) {
      console.log('Total Crash Error:', err)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Supabase Connection Test</h1>
      <button onClick={handleTest}>Test Connection</button>
    </div>
  )
}