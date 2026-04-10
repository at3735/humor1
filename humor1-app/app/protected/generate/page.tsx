"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import CaptionGenerator from '../CaptionGenerator'
import './../../globals.css'

export default function GeneratePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email)
      } else {
        window.location.href = '/'
      }
    }
    fetchUser()
  }, [])

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
              Upload an image from your computer, click Generate, and wait a few minutes while the model comes up with funny captions. Accepted file types: .jpeg, .png, .webp, .gif, .heic.
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

      <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif', marginBottom: '30px', fontSize: '2em', fontWeight: 'bold' }}>Generate New Captions</h1>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <CaptionGenerator />
      </div>
    </div>
  )
}
