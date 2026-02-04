"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

// Defining what a Caption looks like helps fix the TypeScript error
interface Caption {
  id: string | number;
  text?: string;
  content?: string;
  created_at?: string;
}

export default function ListPage() {
  // We use <Caption[]> to tell TypeScript this is a list of objects
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // This runs automatically when the page loads
  useEffect(() => {
    fetchCaptions();
  }, []);

  async function fetchCaptions() {
    try {
      setLoading(true);
      setErrorMsg(null);

      // 1. Fetching rows from your pre-existing table
      const { data, error } = await supabase
        .from('captions')
        .select('*');

      if (error) throw error;

      // 2. Set the data to state
      setCaptions(data || []);
    } catch (error: any) {
      console.error('Error fetching:', error.message);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: '40px' }}>Loading captions...</div>;
  if (errorMsg) return <div style={{ padding: '40px', color: 'red' }}>Error: {errorMsg}</div>;

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>Caption Gallery</h1>
        <p>Fetching directly from Supabase "captions" table.</p>
        <button
          onClick={fetchCaptions}
          style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Refresh Data
        </button>
      </header>

      <hr />

      {/* 3. Rendering the list in a Card format */}
      <div style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
        {captions.length === 0 ? (
          <p>No rows found in the "captions" table.</p>
        ) : (
          captions.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #eaeaea',
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}
            >
              <p style={{ fontSize: '1.25rem', fontWeight: '500', margin: '0 0 10px 0', color: '#333' }}>
                {/* It checks for .text or .content depending on your column name */}
                "{item.text || item.content || "Untitled Caption"}"
              </p>
              <div style={{ fontSize: '0.85rem', color: '#888' }}>
                <span>ID: {item.id}</span>
                {item.created_at && (
                  <span style={{ marginLeft: '15px' }}>
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}