"use server"

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API_BASE_URL = 'https://api.almostcrackd.ai'

// Helper function to get the Supabase access token
async function getSupabaseAccessToken() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
      },
    }
  )
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

// --- NEW: Caption Generation Pipeline ---

// Step 1: Generate a presigned URL
export async function generatePresignedUrl(contentType: string) {
  const token = await getSupabaseAccessToken()
  if (!token) throw new Error('Authentication token not found.')

  const response = await fetch(`${API_BASE_URL}/pipeline/generate-presigned-url`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contentType }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Failed to generate presigned URL:', errorBody)
    throw new Error(`Failed to generate presigned URL: ${response.statusText}`)
  }

  return response.json()
}

// Step 3: Register the uploaded image URL
export async function registerImageUrl(cdnUrl: string) {
  const token = await getSupabaseAccessToken()
  if (!token) throw new Error('Authentication token not found.')

  const response = await fetch(`${API_BASE_URL}/pipeline/upload-image-from-url`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Failed to register image URL:', errorBody)
    throw new Error(`Failed to register image URL: ${response.statusText}`)
  }

  return response.json()
}

// Step 4: Generate captions from the registered image
export async function generateCaptionsForImage(imageId: string) {
  const token = await getSupabaseAccessToken()
  if (!token) throw new Error('Authentication token not found.')

  const response = await fetch(`${API_BASE_URL}/pipeline/generate-captions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageId }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Failed to generate captions:', errorBody)
    throw new Error(`Failed to generate captions: ${response.statusText}`)
  }

  return response.json()
}


// --- Existing: Caption Voting ---

export async function rateCaption(captionId: string, voteType: 'up' | 'down') {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
      },
    }
  )

  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Must be logged in to vote")

  // 2. Determine the vote value and the current timestamp
  const voteValue = voteType === 'up' ? 1 : -1;
  const currentTime = new Date().toISOString();

  // 3. Insert the vote into 'caption_votes', setting both timestamps
  const { error } = await supabase
    .from('caption_votes')
    .insert({
      caption_id: captionId,
      profile_id: user.id,
      vote_value: voteValue,
      created_datetime_utc: currentTime,
      modified_datetime_utc: currentTime, // Set modified time on creation
    })

  if (error) {
    console.error("Error voting:", error.message)
    return { error: error.message }
  }

  // 4. Refresh the page data
  revalidatePath('/protected')
  return { success: true }
}
