"use client"
import { rateCaption } from './actions'

// Add onVoteSuccess to the component's props
export default function VoteButtons({ captionId, onVoteSuccess }: { captionId: string, onVoteSuccess?: () => void }) {

  const handleVote = async (type: 'up' | 'down') => {
    const result = await rateCaption(captionId, type)
    if (result?.error) {
      alert("Failed to vote: " + result.error)
    } else {
      // If a callback is provided, call it after a successful vote
      if (onVoteSuccess) {
        onVoteSuccess();
      } else {
        // Fallback for components that don't use the callback
        alert("Vote submitted!")
      }
    }
  }

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={() => handleVote('up')}
        style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: '2px solid #000', borderRadius: '4px', fontSize: '1rem' }}
      >
        👍 Upvote
      </button>
      <button
        onClick={() => handleVote('down')}
        style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#F44336', color: 'white', border: '2px solid #000', borderRadius: '4px', fontSize: '1rem' }}
      >
        👎 Downvote
      </button>
    </div>
  )
}
