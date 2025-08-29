import React from 'react'
import './GameStatus.css'

const GameStatus = ({ currentPlayer, winner, isDraw, onReset }) => {
  const getStatusMessage = () => {
    if (winner) {
      return `🎉 ${winner.charAt(0).toUpperCase() + winner.slice(1)} Player Wins!`
    }
    if (isDraw) {
      return "🤝 It's a Draw!"
    }
    return `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} Player's Turn`
  }

  const getPlayerColor = () => {
    if (winner) return winner
    if (isDraw) return 'draw'
    return currentPlayer
  }

  return (
    <div className="game-status">
      <div className={`status-message ${getPlayerColor()}`}>
        <div className="status-text">
          {getStatusMessage()}
        </div>
        {!isDraw && !winner && (
          <div className={`current-player-indicator ${currentPlayer}`} />
        )}
      </div>
      
      <button 
        className="reset-button"
        onClick={onReset}
      >
        🔄 New Game
      </button>
    </div>
  )
}

export default GameStatus
