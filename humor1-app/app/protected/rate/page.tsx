"use client" // Step 1: Convert to a Client Component

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client' // Use client-side Supabase
import Link from 'next/link'
import VoteButtons from '../VoteButtons'

export default function RatePage() {
  const [captions, setCaptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Step 2: Fetch data on the client
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
      } else {
        // This should ideally not happen due to server-side redirects, but is good practice
        window.location.href = '/';
        return;
      }

      const { data, error } = await supabase
        .from('captions')
        .select(`*, images(url)`)
        .not('image_id', 'is', null)
        .order('created_datetime_utc', { ascending: false });

      if (error) {
        setError(error.message)
      } else {
        setCaptions(data)
      }
      setLoading(false)
    };

    fetchData();
  }, []);

  // Step 5: The callback function to remove a caption
  const handleVoteSuccess = (votedCaptionId: string) => {
    setCaptions(prevCaptions => prevCaptions.filter(c => c.id !== votedCaptionId));
  };

  const currentCaption = captions.length > 0 ? captions[0] : null;

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
        {userEmail && (
          <div style={{ backgroundColor: '#fff', padding: '10px 20px', border: '2px solid #000' }}>
            <span>Logged in as: <strong>{userEmail}</strong></span>
          </div>
        )}
      </div>

      <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif', marginBottom: '30px' }}>Rate Captions</h1>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {loading && <p style={{ textAlign: 'center' }}>Loading captions...</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

        {!loading && !error && currentCaption && (
          <div
            key={currentCaption.id}
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              border: '2px solid #000',
              boxShadow: '4px 4px 0px #000'
            }}
          >
            {currentCaption.images?.url && (
              <img
                src={currentCaption.images.url}
                alt="Caption image"
                style={{
                  maxHeight: '300px',
                  maxWidth: '100%',
                  width: 'auto',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto 20px auto',
                  borderRadius: '4px',
                }}
              />
            )}
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 20px 0', textAlign: 'center' }}>
              {currentCaption.content}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {/* Step 4: Pass the callback to VoteButtons */}
              <VoteButtons captionId={currentCaption.id} onVoteSuccess={() => handleVoteSuccess(currentCaption.id)} />
            </div>
          </div>
        )}

        {!loading && captions.length === 0 && (
          <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
            All captions have been rated!
          </p>
        )}
      </div>
    </div>
  )
}
