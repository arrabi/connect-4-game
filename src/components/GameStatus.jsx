import React, { useState } from 'react'
import ShareModal from './ShareModal'
import './GameStatus.css'

const GameStatus = ({ currentPlayer, winner, isDraw, gameMode = '2-player', isAIThinking = false }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const getStatusMessage = () => {
    if (winner) {
      if (gameMode === 'vs-ai') {
        return winner === 'red' 
          ? '🎉 You Win! Great job!' 
          : '🤖 AI Wins! Better luck next time!'
      }
      return `🎉 ${winner.charAt(0).toUpperCase() + winner.slice(1)} Player Wins!`
    }
    if (isDraw) {
      return gameMode === 'vs-ai' ? "🤝 It's a Draw! Good game!" : "🤝 It's a Draw!"
    }
    if (gameMode === 'vs-ai') {
      if (isAIThinking) {
        return '🤖 AI is thinking...'
      }
      return currentPlayer === 'red' ? 'Your Turn' : 'AI Turn'
    }
    return `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} Player's Turn`
  }

  const getPlayerColor = () => {
    if (winner) return winner
    if (isDraw) return 'draw'
    if (gameMode === 'vs-ai' && isAIThinking) return 'yellow' // AI thinking uses yellow
    return currentPlayer
  }

  return (
    <div className="game-status">
      <div className={`status-message ${getPlayerColor()}`}>
        <div className="status-text">
          {getStatusMessage()}
        </div>
        {!isDraw && !winner && (
          <div className={`current-player-indicator ${currentPlayer}`}>
            {gameMode === 'vs-ai' && isAIThinking && (
              <div className="ai-thinking-animation">🤖</div>
            )}
          </div>
        )}
      </div>
      
      <div className="game-buttons">
        <button 
          className="share-button"
          onClick={() => setIsShareModalOpen(true)}
          title="Share this game with friends"
        >
          📱 Share
        </button>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  )
}

export default GameStatus
