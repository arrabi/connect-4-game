import React, { useState, useEffect } from 'react'
import ShareModal from './ShareModal'
import playerStatsManager from '../utils/playerStats'
import './GameStatus.css'

const GameStatus = ({ 
  currentPlayer, 
  winner, 
  isDraw, 
  gameMode = '2-player', 
  isAIThinking = false,
  ai1Thinking = false,
  ai2Thinking = false,
  player1Name = '',
  player2Name = '',
  gameDuration = 0,
  gameStartTime = null,
  onOpenPlayerSetup
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  // Update current game time every second
  useEffect(() => {
    let interval = null
    if (gameStartTime && !winner && !isDraw) {
      interval = setInterval(() => {
        setCurrentTime(Math.round((Date.now() - gameStartTime) / 1000))
      }, 1000)
    } else {
      setCurrentTime(gameDuration)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStartTime, winner, isDraw, gameDuration])

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
      const winnerName = winner === 'red' 
        ? (player1Name || 'Red Player') 
        : (player2Name || 'Yellow Player')
      return `🎉 ${winnerName} Wins!`
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
      const playerName = player1Name || 'You'
      return currentPlayer === 'red' ? `${playerName}'s Turn` : 'AI Turn'
    } else if (gameMode === 'ai-vs-ai') {
      if (ai1Thinking) {
        return '🔴 AI Player 1 is thinking...'
      } else if (ai2Thinking) {
        return '🟡 AI Player 2 is thinking...'
      }
      return currentPlayer === 'red' ? '🔴 AI Player 1 Turn' : '🟡 AI Player 2 Turn'
    }
    const playerName = currentPlayer === 'red' 
      ? (player1Name || 'Red Player') 
      : (player2Name || 'Yellow Player')
    return `${playerName}'s Turn`
  }

  const getCurrentPlayerName = () => {
    if (gameMode === 'vs-ai') {
      return currentPlayer === 'red' ? (player1Name || 'You') : 'AI'
    }
    return currentPlayer === 'red' 
      ? (player1Name || 'Red Player') 
      : (player2Name || 'Yellow Player')
  }

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPlayerStats = (playerName) => {
    if (!playerName) return null
    return playerStatsManager.getFormattedStats(playerName)
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
      {/* Player Info Section */}
      <div className="player-info-section">
        {gameMode === 'vs-ai' ? (
          <div className="player-info">
            <div className="player-header">
              <span className="player-label">🎮 Player</span>
              {player1Name ? (
                <span className="player-name">{player1Name}</span>
              ) : (
                <button 
                  className="set-name-button"
                  onClick={() => onOpenPlayerSetup && onOpenPlayerSetup('red')}
                  title="Set your name to track scores"
                >
                  📝 Set Name
                </button>
              )}
            </div>
            {player1Name && (
              <div className="player-stats">
                {(() => {
                  const stats = getPlayerStats(player1Name)
                  return stats ? (
                    <div className="stats-display">
                      <span className="stat-item">W: {stats.wins}</span>
                      <span className="stat-item">L: {stats.losses}</span>
                      <span className="stat-item">D: {stats.draws}</span>
                      <span className="stat-item">Rate: {stats.winRate}</span>
                      {stats.bestTime && stats.bestTime !== 'N/A' && (
                        <span className="stat-item">Best: {stats.bestTimeFormatted}</span>
                      )}
                    </div>
                  ) : null
                })()}
              </div>
            )}
          </div>
        ) : (
          <div className="players-info">
            <div className="player-info player-1">
              <div className="player-header">
                <span className="player-indicator red"></span>
                {player1Name ? (
                  <span className="player-name">{player1Name}</span>
                ) : (
                  <button 
                    className="set-name-button"
                    onClick={() => onOpenPlayerSetup && onOpenPlayerSetup('red')}
                    title="Set player 1 name"
                  >
                    📝 Set Name
                  </button>
                )}
              </div>
              {player1Name && (
                <div className="player-stats">
                  {(() => {
                    const stats = getPlayerStats(player1Name)
                    return stats ? (
                      <div className="stats-display">
                        <span className="stat-item">{stats.wins}W</span>
                        <span className="stat-item">{stats.losses}L</span>
                        <span className="stat-item">{stats.draws}D</span>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </div>
            
            <div className="vs-divider">VS</div>
            
            <div className="player-info player-2">
              <div className="player-header">
                <span className="player-indicator yellow"></span>
                {player2Name ? (
                  <span className="player-name">{player2Name}</span>
                ) : (
                  <button 
                    className="set-name-button"
                    onClick={() => onOpenPlayerSetup && onOpenPlayerSetup('yellow')}
                    title="Set player 2 name"
                  >
                    📝 Set Name
                  </button>
                )}
              </div>
              {player2Name && (
                <div className="player-stats">
                  {(() => {
                    const stats = getPlayerStats(player2Name)
                    return stats ? (
                      <div className="stats-display">
                        <span className="stat-item">{stats.wins}W</span>
                        <span className="stat-item">{stats.losses}L</span>
                        <span className="stat-item">{stats.draws}D</span>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Game Timer */}
      {gameMode === 'vs-ai' && (
        <div className="game-timer">
          <span className="timer-label">⏱️ Time:</span>
          <span className="timer-value">{formatTime(currentTime)}</span>
        </div>
      )}

      {/* Status Message */}
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
