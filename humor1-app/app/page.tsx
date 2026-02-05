"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

export default function TestPage() {
  // Changed initial state to an empty array to hold multiple rows
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Component loaded, attempting fetch...');
      try {
        // REMOVED .limit(1) to get all rows
        const { data, error } = await supabase.from('captions').select('*')

        if (error) {
          console.log('Supabase Error:', error.message)
          setErrorMessage("Error: " + error.message)
        } else {
          console.log('Data found:', data)
          setDisplayData(data || [])
        }
      } catch (err: any) {
        console.log('Total Crash Error:', err)
        setErrorMessage("Crash: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Supabase Connection Test</h1>

      {loading && <p>Loading data...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Loop through the array and print each row in its own <p> tag */}
      {!loading && displayData.map((row, index) => (
        <p key={index} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
          {JSON.stringify(row)}
        </p>
      ))}
    </div>
  )
}