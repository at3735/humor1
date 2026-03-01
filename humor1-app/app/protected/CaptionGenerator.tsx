"use client"

import { useState, useEffect } from 'react'
import { generatePresignedUrl, registerImageUrl, generateCaptionsForImage } from './actions'

export default function CaptionGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [captions, setCaptions] = useState<any[] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile)
      setStatus('')
      setCaptions(null)

      // Create a local URL for image preview
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreviewUrl(previewUrl);
    } else {
      setFile(null)
      setImagePreviewUrl(null)
    }
  }

  // Clean up the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setStatus('Please select a file first.')
      return
    }

    setIsSubmitting(true)
    setCaptions(null)

    try {
      setStatus('Step 1/4: Generating upload URL...')
      const { presignedUrl, cdnUrl } = await generatePresignedUrl(file.type)
      if (!presignedUrl || !cdnUrl) throw new Error('Failed to get presigned URL.')

      setStatus('Step 2/4: Uploading image...')
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!uploadResponse.ok) throw new Error('Failed to upload image.')

      setStatus('Step 3/4: Registering image...')
      const { imageId } = await registerImageUrl(cdnUrl)
      if (!imageId) throw new Error('Failed to register image.')

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
      padding: '30px',
      border: '2px solid #000',
      backgroundColor: '#fff',
      boxShadow: '4px 4px 0px #000'
    }}>
      <h3 style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: 0, marginBottom: '20px' }}>Generate New Captions</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="file-upload"
            style={{
              display: 'inline-block',
              padding: '10px 15px',
              backgroundColor: '#333',
              color: '#fff',
              border: '2px solid #000',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
            onChange={handleFileChange}
            disabled={isSubmitting}
            style={{ display: 'none' }}
          />
          <span style={{ marginLeft: '15px', fontStyle: 'italic' }}>
            {file ? file.name : 'No file selected'}
          </span>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !file}
          style={{
            width: '100%',
            padding: '12px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            backgroundColor: isSubmitting ? '#ccc' : '#0070f3',
            color: 'white',
            border: '2px solid #000',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '2px 2px 0px #000'
          }}
        >
          {isSubmitting ? 'Generating...' : 'Generate Captions'}
        </button>
      </form>

      {status && <p style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold' }}>{status}</p>}

      {/* --- NEW: Display results --- */}
      {captions && captions.length > 0 && (
        <div style={{ marginTop: '25px' }}>
          {/* Display the uploaded image */}
          {imagePreviewUrl && (
            <img
              src={imagePreviewUrl}
              alt="Uploaded preview"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '4px',
                marginBottom: '20px',
                border: '1px solid #ddd'
              }}
            />
          )}

          <h4 style={{ fontFamily: 'sans-serif' }}>Generated Captions:</h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            {captions.map((caption: any) => (
              <div key={caption.id} style={{
                backgroundColor: '#f4f4f4',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                {caption.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
