import React, { useEffect } from 'react'
import './ConfirmationModal.css'

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel()
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
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  return (
    <div className="confirmation-modal-backdrop" onClick={handleBackdropClick}>
      <div className="confirmation-modal">
        <div className="confirmation-modal-header">
          <h2>{title}</h2>
          <button 
            className="close-button"
            onClick={onCancel}
            aria-label="Close confirmation modal"
          >
            ×
          </button>
        </div>
        
        <div className="confirmation-modal-content">
          <p className="confirmation-message">{message}</p>
          
          <div className="confirmation-buttons">
            <button 
              className="confirm-button"
              onClick={onConfirm}
              autoFocus
            >
              Yes
            </button>
            <button 
              className="cancel-button"
              onClick={onCancel}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal