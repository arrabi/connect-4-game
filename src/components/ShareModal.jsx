import React, { useEffect } from 'react'
import './ShareModal.css'

const ShareModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const gameUrl = 'https://arrabi.github.io/connect-4-game'

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(gameUrl)
      // Show a brief success indicator
      const button = document.querySelector('.copy-button')
      if (button) {
        const originalText = button.textContent
        button.textContent = '✅ Copied!'
        setTimeout(() => {
          button.textContent = originalText
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="share-modal-backdrop" onClick={handleBackdropClick}>
      <div className="share-modal">
        <div className="share-modal-header">
          <h2>🎮 Share Connect 4 Game</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close share modal"
          >
            ×
          </button>
        </div>
        
        <div className="share-modal-content">
          <div className="qr-section">
            <p>📱 <strong>Scan with your phone to play instantly!</strong></p>
            <div className="qr-code-container">
              <img 
                src="/connect-4-game/qr-code.svg" 
                alt="QR Code for Connect 4 Game"
                className="qr-code-image"
              />
            </div>
          </div>
          
          <div className="url-section">
            <label htmlFor="game-url">🔗 Or share this link:</label>
            <div className="url-input-container">
              <input 
                id="game-url"
                type="text" 
                value={gameUrl}
                readOnly
                className="url-input"
              />
              <button 
                className="copy-button"
                onClick={handleCopyUrl}
                title="Copy URL to clipboard"
              >
                📋 Copy
              </button>
            </div>
          </div>
          
          <div className="instructions">
            <h3>How to play:</h3>
            <ul>
              <li>📱 Mobile: Scan the QR code with your camera</li>
              <li>💻 Desktop: Copy and share the link</li>
              <li>🎯 No installation required - plays in any browser!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareModal
