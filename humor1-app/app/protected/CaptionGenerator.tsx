"use client"

import { useState } from 'react'
import { generatePresignedUrl, registerImageUrl, generateCaptionsForImage } from './actions'

export default function CaptionGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [captions, setCaptions] = useState<any[] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setStatus('')
      setCaptions(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setStatus('Please select a file first.')
      return
    }

    setIsSubmitting(true)
    setCaptions(null)

    try {
      // Step 1: Generate a presigned URL
      setStatus('Step 1/4: Generating upload URL...')
      const { presignedUrl, cdnUrl } = await generatePresignedUrl(file.type)
      if (!presignedUrl || !cdnUrl) throw new Error('Failed to get presigned URL.')

      // Step 2: Upload image bytes to the presigned URL
      setStatus('Step 2/4: Uploading image...')
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!uploadResponse.ok) throw new Error('Failed to upload image.')

      // Step 3: Register the image URL in the pipeline
      setStatus('Step 3/4: Registering image...')
      const { imageId } = await registerImageUrl(cdnUrl)
      if (!imageId) throw new Error('Failed to register image.')

      // Step 4: Generate captions
      setStatus('Step 4/4: Generating captions...')
      const generatedCaptions = await generateCaptionsForImage(imageId)

      setStatus('Success! Captions generated.')
      setCaptions(generatedCaptions)

    } catch (error) {
      console.error('Caption generation failed:', error)
      setStatus(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{
      marginTop: '40px',
      padding: '20px',
      border: '2px solid #000',
      backgroundColor: '#fff',
      boxShadow: '4px 4px 0px #000'
    }}>
      <h3 style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: 0 }}>Generate New Captions</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="file-upload" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Upload an Image:
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
            onChange={handleFileChange}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !file}
          style={{
            width: '100%',
            padding: '10px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            backgroundColor: isSubmitting ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
        >
          {isSubmitting ? 'Generating...' : 'Generate Captions'}
        </button>
      </form>
      {status && <p style={{ marginTop: '15px', textAlign: 'center' }}>{status}</p>}
      {captions && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontFamily: 'sans-serif' }}>Generated Captions:</h4>
          <pre style={{
            backgroundColor: '#f4f4f4',
            padding: '15px',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {JSON.stringify(captions, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
