"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import VoteButtons from '../VoteButtons'
import './../../globals.css'

export default function RatePage() {
  const [captions, setCaptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [ratedCount, setRatedCount] = useState(0)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)

        const { data: votedCaptionsData, error: votedCaptionsError } = await supabase
          .from('caption_votes')
          .select('caption_id')
          .eq('profile_id', user.id);

        if (votedCaptionsError) {
          setError(votedCaptionsError.message);
          setLoading(false);
          return;
        }

        const votedCaptionIds = votedCaptionsData ? votedCaptionsData.map(vote => vote.caption_id) : [];

        let query = supabase
          .from('captions')
          .select(`*, images(url)`)
          .not('image_id', 'is', null)
          .order('created_datetime_utc', { ascending: false });

        if (votedCaptionIds.length > 0) {
          query = query.not('id', 'in', `(${votedCaptionIds.join(',')})`);
        }

        const { data, error } = await query;

        if (error) {
          setError(error.message)
        } else {
          setCaptions(data)
        }
      } else {
        window.location.href = '/';
        return;
      }
      setLoading(false)
    };

    fetchData();
  }, []);

  const handleVoteSuccess = (votedCaptionId: string) => {
    setIsVoting(true);
    setCaptions(prevCaptions => prevCaptions.filter(c => c.id !== votedCaptionId));

    const newRatedCount = ratedCount + 1;
    setRatedCount(newRatedCount);

    if (newRatedCount > 0 && newRatedCount % 5 === 0) {
      alert(`WOHOOOO!!!! YOU HAVE RATED ${newRatedCount} CAPTIONS`);
    }
  };

  const currentCaption = captions.length > 0 ? captions[0] : null;

  useEffect(() => {
    if (currentCaption && currentCaption.images?.url) {
      const img = new Image();
      img.src = currentCaption.images.url;
      img.onload = () => {
        setIsVoting(false);
      };
    } else if (captions.length === 0 && !loading) {
      setIsVoting(false);
    }
  }, [currentCaption, captions.length, loading]);

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#f2eee5', minHeight: '100vh' }}>
      {showDisclaimer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            textAlign: 'center',
            border: '2px solid #000',
          }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '1.5em', marginBottom: '15px' }}>Disclaimer</h2>
            <p style={{ marginBottom: '25px', fontSize: '1.1em' }}>
              Please note that the model has only generated the captions for an image. Please judge the captions, not the images.
            </p>
            <button
              onClick={() => setShowDisclaimer(false)}
              style={{
                padding: '10px 25px',
                fontSize: '1.1em',
                fontWeight: 'bold',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '30px',
      }}>
        <div>
          <Link
            href="/protected"
            className="back-button"
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              color: '#fff',
              backgroundColor: '#000',
              border: '2px solid #000',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '2px 2px 0px #000',
              display: 'block',
              marginBottom: '10px',
              transition: 'transform 0.2s, background-color 0.2s',
            }}
          >
            &larr; Back to Menu
          </Link>
          <button
            onClick={() => setShowDisclaimer(true)}
            className="disclaimer-button"
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              color: '#fff',
              backgroundColor: '#000',
              border: '2px solid #000',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '2px 2px 0px #000',
              cursor: 'pointer',
              transition: 'transform 0.2s, background-color 0.2s',
            }}
          >
            Disclaimer
          </button>
        </div>
        {userEmail && (
          <div style={{ backgroundColor: '#fff', padding: '10px 20px', border: '2px solid #000' }}>
            <span>Logged in as: <strong>{userEmail}</strong></span>
          </div>
        )}
      </div>

      <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif', marginBottom: '30px', fontSize: '2em', fontWeight: 'bold' }}>Rate Captions</h1>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {loading && <div className="spinner"></div>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

        {isVoting && <div className="spinner"></div>}

        {!loading && !error && !isVoting && currentCaption && (
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
            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0 0 20px 0', textAlign: 'center' }}>
              {currentCaption.content}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <VoteButtons captionId={currentCaption.id} onVoteSuccess={() => handleVoteSuccess(currentCaption.id)} />
            </div>
          </div>
        )}

        {!loading && !isVoting && captions.length === 0 && (
          <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
            All captions have been rated!
          </p>
        )}
      </div>
    </div>
  )
}
