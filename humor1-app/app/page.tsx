"use client" // <--- This is the magic line!

import { supabase } from '../utils/supabase'

export default function TestPage() {
  const handleTest = async () => {
    // Note: Change 'your_table_name' to an actual table in your Supabase DB
    const { data, error } = await supabase.from('captions').select('*').limit(1)
    console.log('here')
    
    if (error) {
      console.log('Error:', error.message)
    } else {
      console.log('Data:', data)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Supabase Connection Test</h1>
      <button onClick={handleTest}>Test Connection</button>
      <p>Check your browser console (F12) after clicking!</p>
    </div>
  )
}