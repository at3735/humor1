"use client"

import { useEffect, useState } from 'react' // Added useEffect
import { supabase } from '../utils/supabase'

export default function TestPage() {
  const [displayData, setDisplayData] = useState<any>("Loading data...");

  useEffect(() => {
    // This function runs automatically on load
    const fetchData = async () => {
      console.log('Component loaded, attempting fetch...');
      try {
        const { data, error } = await supabase.from('captions').select('*').limit(1)

        if (error) {
          console.log('Supabase Error:', error.message)
          setDisplayData("Error: " + error.message)
        } else {
          console.log('Data found:', data)
          setDisplayData(JSON.stringify(data))
        }
      } catch (err: any) {
        console.log('Total Crash Error:', err)
        setDisplayData("Crash: " + err.message)
      }
    }

    fetchData()
  }, []) // The empty array [] means "run only once on load"

  return (
    <div style={{ padding: '20px' }}>
      <h1>Supabase Connection Test</h1>
      <p>{displayData}</p>
    </div>
  )
}