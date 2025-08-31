import React, { useState, useEffect } from 'react'
import playerStatsManager from '../utils/playerStats'
import './PlayerSetup.css'

const PlayerSetup = ({ isOpen, onClose, onPlayerSetup, currentPlayer = 'red' }) => {
  const [playerName, setPlayerName] = useState('')
  const [isGuest, setIsGuest] = useState(false)
  const [showExistingPlayers, setShowExistingPlayers] = useState(false)
  const [existingPlayers, setExistingPlayers] = useState([])

  useEffect(() => {
    if (isOpen) {
      setPlayerName('')
      setIsGuest(false)
      setShowExistingPlayers(false)
      setExistingPlayers(playerStatsManager.getAllPlayerNames())
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const handleConfirm = () => {
    const finalName = isGuest ? '' : playerName.trim()
    onPlayerSetup(finalName)
    // Don't call onClose() here - let the parent component decide when to close
  }

  const handleExistingPlayerSelect = (name) => {
    setPlayerName(name)
    setIsGuest(false)
    setShowExistingPlayers(false)
  }

  const handleGuestToggle = (guestMode) => {
    setIsGuest(guestMode)
    if (guestMode) {
      setPlayerName('')
    }
  }

  const isValid = isGuest || playerName.trim().length > 0

  const getPlayerDisplayName = () => {
    return currentPlayer === 'red' ? 'Player 1' : 'Player 2'
  }

  return (
    <div className="player-setup-backdrop" onClick={handleBackdropClick}>
      <div className="player-setup-modal">
        <div className="player-setup-header">
          <h2>👤 {getPlayerDisplayName()} Setup</h2>
          <button 
            className="close-button"
            onClick={handleCancel}
            aria-label="Close player setup modal"
          >
            ×
          </button>
        </div>
        
        <div className="player-setup-content">
          <p className="setup-description">
            Enter your name to track your scores, or play as a guest.
          </p>

          <div className="player-options">
            <div className="option-section">
              <div className="option-header">
                <input
                  type="radio"
                  id="named-player"
                  name="player-type"
                  checked={!isGuest}
                  onChange={() => handleGuestToggle(false)}
                />
                <label htmlFor="named-player">🏆 Play with name (track scores)</label>
              </div>
              
              {!isGuest && (
                <div className="name-input-section">
                  <input
                    type="text"
                    className="player-name-input"
                    placeholder="Enter your name..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={20}
                    autoFocus
                  />
                  
                  {existingPlayers.length > 0 && (
                    <div className="existing-players-section">
                      <button
                        type="button"
                        className="toggle-existing-button"
                        onClick={() => setShowExistingPlayers(!showExistingPlayers)}
                      >
                        {showExistingPlayers ? '▼' : '▶'} Previous players ({existingPlayers.length})
                      </button>
                      
                      {showExistingPlayers && (
                        <div className="existing-players-list">
                          {existingPlayers.map(name => (
                            <button
                              key={name}
                              className="existing-player-button"
                              onClick={() => handleExistingPlayerSelect(name)}
                            >
                              <span className="player-name">{name}</span>
                              <span className="player-stats">
                                {(() => {
                                  const stats = playerStatsManager.getFormattedStats(name)
                                  return stats ? `${stats.wins}W ${stats.losses}L ${stats.draws}D` : ''
                                })()}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="option-section">
              <div className="option-header">
                <input
                  type="radio"
                  id="guest-player"
                  name="player-type"
                  checked={isGuest}
                  onChange={() => handleGuestToggle(true)}
                />
                <label htmlFor="guest-player">👤 Play as guest (no score tracking)</label>
              </div>
            </div>
          </div>

          <div className="setup-buttons">
            <button 
              className="confirm-button"
              onClick={handleConfirm}
              disabled={!isValid}
            >
              {isGuest ? 'Play as Guest' : 'Start Game'}
            </button>
            <button 
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerSetup