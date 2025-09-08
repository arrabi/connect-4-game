import React, { useState, useEffect } from 'react'
import soundManager from '../utils/soundManager'
import './SoundControls.css'

const SoundControls = () => {
  // Initialize control states from the sound manager to reflect default (music off)
  const initialStatus = soundManager.getSoundStatus()
  const [soundEnabled, setSoundEnabled] = useState(initialStatus.soundEffects)
  const [musicEnabled, setMusicEnabled] = useState(initialStatus.backgroundMusic)
  const [currentSong, setCurrentSong] = useState(initialStatus.currentSong)
  const [volume, setVolume] = useState(soundManager.getVolume ? soundManager.getVolume() : 0.5)

  useEffect(() => {
    // Update current song info periodically. Do not auto-play music on mount — browsers
    // require a user gesture to start audio. The user must press the music button.
    const updateSongInfo = () => {
      const status = soundManager.getSoundStatus()
      setCurrentSong(status.currentSong)
      setMusicEnabled(status.backgroundMusic)
      setSoundEnabled(status.soundEffects)
  setVolume(status.volume ?? (soundManager.getVolume ? soundManager.getVolume() : 0.5))
    }

    const interval = setInterval(updateSongInfo, 1000)

    return () => {
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

  const increaseVolume = () => {
    const v = soundManager.increaseVolume ? soundManager.increaseVolume(0.1) : null
    setVolume(soundManager.getVolume ? soundManager.getVolume() : volume)
  }

  const decreaseVolume = () => {
    const v = soundManager.decreaseVolume ? soundManager.decreaseVolume(0.1) : null
    setVolume(soundManager.getVolume ? soundManager.getVolume() : volume)
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

      <button
        className={`sound-control-button next-song ${musicEnabled ? 'enabled' : 'disabled'}`}
        onClick={playNextSong}
        title="Play next song"
        aria-label="Play next song"
        disabled={!musicEnabled}
      >
        ⏭️
      </button>

      <button
        className="sound-control-button volume-down"
        onClick={decreaseVolume}
        title="Volume down"
        aria-label="Decrease music volume"
        disabled={!musicEnabled}
      >
        🔉
      </button>

      <div className="volume-label" title={`Volume: ${Math.round((volume || 0) * 100)}%`}>
        {Math.round((volume || 0) * 100)}%
      </div>

      <button
        className="sound-control-button volume-up"
        onClick={increaseVolume}
        title="Volume up"
        aria-label="Increase music volume"
        disabled={!musicEnabled}
      >
        🔊
      </button>

      {currentSong && musicEnabled && (
        <div className="current-song-info" title={`Now playing: ${currentSong}`}>
          🎵 {currentSong}
        </div>
      )}
    </div>
  )
}

export default SoundControls