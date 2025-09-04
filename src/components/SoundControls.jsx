import React, { useState, useEffect } from 'react'
import soundManager from '../utils/soundManager'
import './SoundControls.css'

const SoundControls = () => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [currentSong, setCurrentSong] = useState(null)

  useEffect(() => {
    // Start background music on component mount
    soundManager.startBackgroundMusic()
    
    // Update current song info
    const updateSongInfo = () => {
      const status = soundManager.getSoundStatus()
      setCurrentSong(status.currentSong)
    }
    
    const interval = setInterval(updateSongInfo, 1000)
    
    return () => {
      // Clean up on unmount
      soundManager.stopBackgroundMusic()
      clearInterval(interval)
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

  const playNextSong = () => {
    soundManager.nextSong()
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

      {musicEnabled && (
        <button
          className="sound-control-button next-song"
          onClick={playNextSong}
          title="Play next song"
          aria-label="Play next song"
        >
          ⏭️
        </button>
      )}

      {currentSong && musicEnabled && (
        <div className="current-song-info" title={`Now playing: ${currentSong}`}>
          🎵 {currentSong}
        </div>
      )}
    </div>
  )
}

export default SoundControls