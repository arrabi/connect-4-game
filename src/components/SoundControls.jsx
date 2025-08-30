import React, { useState, useEffect } from 'react'
import soundManager from '../utils/soundManager'
import './SoundControls.css'

const SoundControls = () => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)

  useEffect(() => {
    // Start background music on component mount
    soundManager.startBackgroundMusic()
    
    return () => {
      // Clean up on unmount
      soundManager.stopBackgroundMusic()
    }
  }, [])

  const toggleSoundEffects = () => {
    const newState = soundManager.toggleSoundEffects()
    setSoundEnabled(newState)
  }

  const toggleBackgroundMusic = () => {
    const newState = soundManager.toggleBackgroundMusic()
    setMusicEnabled(newState)
  }

  return (
    <div className="sound-controls">
      <button
        className={`sound-control-button ${soundEnabled ? 'enabled' : 'disabled'}`}
        onClick={toggleSoundEffects}
        title={`Sound Effects: ${soundEnabled ? 'ON' : 'OFF'}`}
        aria-label={`Toggle sound effects ${soundEnabled ? 'off' : 'on'}`}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
      
      <button
        className={`sound-control-button ${musicEnabled ? 'enabled' : 'disabled'}`}
        onClick={toggleBackgroundMusic}
        title={`Background Music: ${musicEnabled ? 'ON' : 'OFF'}`}
        aria-label={`Toggle background music ${musicEnabled ? 'off' : 'on'}`}
      >
        {musicEnabled ? '🎵' : '🎶'}
      </button>
    </div>
  )
}

export default SoundControls