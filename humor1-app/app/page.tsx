"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

export default function ListPage() {
  const [captions, setCaptions] = useState([]) // State to store our rows
  const [loading, setLoading] = useState(true) // State to show a loading message

  // useEffect runs as soon as the page loads
  useEffect(() => {
    fetchCaptions()
  }, [])

  async function fetchCaptions() {
    try {
      setLoading(true)
      // 1. Fetching rows from your pre-existing table
      const { data, error } = await supabase
        .from('captions')
        .select('*')

      if (error) throw error
      setCaptions(data || [])
    } catch (error) {
      console.error('Error fetching:', error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading captions...</p>

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Caption Gallery</h1>
      <hr />

      {/* 2. Rendering the list in a Card format */}
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {captions.length === 0 ? (
          <p>No captions found.</p>
        ) : (
          captions.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {/* Change 'text' or 'content' to match your actual column names */}
              <p style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>
                "{item.text || item.content || "No text column found"}"
              </p>
              <small style={{ color: '#666' }}>ID: {item.id}</small>
            </div>
          ))
        )}
      </div>
    </div>
  )
}