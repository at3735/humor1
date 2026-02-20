"use client"
import { rateCaption } from './actions'

export default function VoteButtons({ captionId }: { captionId: string }) {
  const handleVote = async (type: 'up' | 'down') => {
    const result = await rateCaption(captionId, type)
    if (result?.error) {
      alert("Failed to vote: " + result.error)
    } else {
      alert("Vote submitted!")
    }
  }

  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
      <button
        onClick={() => handleVote('up')}
        style={{ padding: '5px 15px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        👍 Upvote
      </button>
      <button
        onClick={() => handleVote('down')}
        style={{ padding: '5px 15px', cursor: 'pointer', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        👎 Downvote
      </button>
    </div>
  )
}
