"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

export default function ListPage() {
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('captions').select('*')
        if (error) {
          setErrorMessage("Error: " + error.message)
        } else {
          setDisplayData(data || [])
        }
      } catch (err: any) {
        setErrorMessage("Crash: " + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>Humor Project Homework 2</h1>
      <h2 style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>Captions Table</h2>

      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

      <div style={{ display: 'grid', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {!loading && displayData.map((row) => (
          <div
            key={row.id}
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxShadow: '4px 4px 0px #000' // High-contrast "brutalism" style
            }}
          >
            <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '2px solid #eee', fontSize: '1.1rem', fontWeight: 'bold' }}>
              CONTENT: {row.content}
            </div>

            {/* Individual lines for every field in your JSON */}
            <div style={{ fontSize: '0.9rem', color: '#333', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div><strong>ID:</strong> {row.id}</div>
              <div><strong>Created (UTC):</strong> {row.created_datetime_utc}</div>
              <div><strong>Modified (UTC):</strong> {row.modified_datetime_utc || "null"}</div>
              <div><strong>Is Public:</strong> {row.is_public ? "True" : "False"}</div>
              <div><strong>Profile ID:</strong> {row.profile_id}</div>
              <div><strong>Image ID:</strong> {row.image_id}</div>
              <div><strong>Humor Flavor ID:</strong> {row.humor_flavor_id || "null"}</div>
              <div><strong>Is Featured:</strong> {row.is_featured ? "True" : "False"}</div>
              <div><strong>Caption Request ID:</strong> {row.caption_request_id || "null"}</div>
              <div><strong>Like Count:</strong> {row.like_count}</div>
              <div><strong>LLM Prompt Chain ID:</strong> {row.llm_prompt_chain_id || "null"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}