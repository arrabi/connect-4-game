import React, { useState } from 'react'
import ShareModal from './ShareModal'
import './GameStatus.css'

const GameStatus = ({ 
  currentPlayer, 
  winner, 
  isDraw, 
  gameMode = '2-player', 
  isAIThinking = false, 
  ai1Thinking = false, 
  ai2Thinking = false 
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const getStatusMessage = () => {
    if (winner) {
      if (gameMode === 'vs-ai') {
        return winner === 'red' 
          ? '🎉 You Win! Great job!' 
          : '🤖 AI Wins! Better luck next time!'
      } else if (gameMode === 'ai-vs-ai') {
        return winner === 'red' 
          ? '🔴 AI Player 1 Wins!' 
          : '🟡 AI Player 2 Wins!'
      }
      return `🎉 ${winner.charAt(0).toUpperCase() + winner.slice(1)} Player Wins!`
    }
    if (isDraw) {
      if (gameMode === 'vs-ai') {
        return "🤝 It's a Draw! Good game!"
      } else if (gameMode === 'ai-vs-ai') {
        return "🤝 It's a Draw! Both AIs played well!"
      }
      return "🤝 It's a Draw!"
    }
    if (gameMode === 'vs-ai') {
      if (isAIThinking) {
        return '🤖 AI is thinking...'
      }
      return currentPlayer === 'red' ? 'Your Turn' : 'AI Turn'
    } else if (gameMode === 'ai-vs-ai') {
      if (ai1Thinking) {
        return '🔴 AI Player 1 is thinking...'
      } else if (ai2Thinking) {
        return '🟡 AI Player 2 is thinking...'
      }
      return currentPlayer === 'red' ? '🔴 AI Player 1 Turn' : '🟡 AI Player 2 Turn'
    }
    return `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} Player's Turn`
  }

  const getPlayerColor = () => {
    if (winner) return winner
    if (isDraw) return 'draw'
    if (gameMode === 'vs-ai' && isAIThinking) return 'yellow' // AI thinking uses yellow
    if (gameMode === 'ai-vs-ai' && (ai1Thinking || ai2Thinking)) {
      return ai1Thinking ? 'red' : 'yellow'
    }
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
            {gameMode === 'ai-vs-ai' && (ai1Thinking || ai2Thinking) && (
              <div className="ai-thinking-animation">
                {ai1Thinking ? '🔴🤖' : '🟡🤖'}
              </div>
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
