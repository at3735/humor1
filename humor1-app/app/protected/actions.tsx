"use server"

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

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
