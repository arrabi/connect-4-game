// Sound Manager for Connect 4 Game
// Uses Web Audio / HTMLAudio for background MP3 playback and Web Audio oscillators for sound effects.

class SoundManager {
  constructor() {
    this.sounds = {}
    this.isEnabled = true // sound effects
    // Start with background music disabled to avoid autoplay restrictions.
    this.isMusicEnabled = false

    // MP3 playlist and playback state
    this.playlist = [] // filenames (strings) loaded from mp3/manifest.json
    this.currentIndex = -1
    this.bgAudio = null
    this.musicVolume = 0.5 // 0.0 - 1.0

    // WebAudio resources (for sound effects)
    this.audioContext = null
    this.masterGain = null

    this.initializeSounds()
    this.initializeMusic()
  }

  initializeSounds() {
    // Keep simple synthesized effects for game events
    this.sounds = {
      drop: () => this.generateTone(220, 0.18, 'sine'),
      win: () => this.generateWinSound(),
      lose: () => this.generateLoseSound(),
      draw: () => this.generateDrawSound()
    }
  }

  // Simple sound effect generation using Web Audio API
  generateTone(frequency, duration, type = 'sine') {
    if (!this.isEnabled) return null

    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.masterGain = this.audioContext.createGain()
        this.masterGain.gain.value = 0.4
        this.masterGain.connect(this.audioContext.destination)
      } else if (this.audioContext.state === 'suspended') {
        try { this.audioContext.resume() } catch (e) {}
      }

      const now = this.audioContext.currentTime
      const osc = this.audioContext.createOscillator()
      const g = this.audioContext.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(frequency, now)

      g.gain.setValueAtTime(0.0001, now)
      g.gain.exponentialRampToValueAtTime(0.3, now + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      osc.connect(g)
      g.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + duration + 0.02)

      setTimeout(() => {
        try { osc.disconnect(); g.disconnect() } catch (e) {}
      }, (duration + 0.1) * 1000)

      return { osc, g }
    } catch (err) {
      console.warn('WebAudio not available for sound effects:', err)
      return null
    }
  }

  generateWinSound() {
    if (!this.isEnabled) return
    const notes = [261.63, 329.63, 392.0, 523.25]
    notes.forEach((f, i) => setTimeout(() => this.generateTone(f, 0.28, 'sine'), i * 140))
  }

  generateLoseSound() {
    if (!this.isEnabled) return
    const notes = [392.0, 329.63, 261.63, 196.0]
    notes.forEach((f, i) => setTimeout(() => this.generateTone(f, 0.28, 'square'), i * 160))
  }

  // Load MP3 playlist from public/mp3/manifest.json
  async initializeMusic() {
    await this.loadMP3Manifest()
  }

  async loadMP3Manifest() {
    try {
      const basePath = import.meta.env.BASE_URL || '/'
      const manifestUrl = `${basePath}mp3/manifest.json`
      const resp = await fetch(manifestUrl)
      if (!resp.ok) {
        console.warn('MP3 manifest not found at', manifestUrl)
        this.playlist = []
        return
      }
      const files = await resp.json()
      if (!Array.isArray(files)) {
        console.warn('MP3 manifest is not an array')
        this.playlist = []
        return
      }
      this.playlist = files.slice()
      if (this.playlist.length > 0) this.currentIndex = 0
      console.log(`Loaded ${this.playlist.length} MP3 files from manifest`)
    } catch (err) {
      console.warn('Failed to load MP3 manifest:', err)
      this.playlist = []
    }
  }

  // Background music control (MP3)
  async startBackgroundMusic() {
    if (!this.isMusicEnabled) return
    if (!this.playlist || this.playlist.length === 0) {
      console.warn('No MP3 playlist available')
      return
    }

    // Create audio element if needed
    if (!this.bgAudio) {
      this.bgAudio = new Audio()
      this.bgAudio.preload = 'auto'
      this.bgAudio.addEventListener('ended', () => this._onTrackEnded())
      this.bgAudio.addEventListener('error', (e) => console.warn('Background audio error', e))
    }

    // Ensure index is valid
    if (this.currentIndex < 0 || this.currentIndex >= this.playlist.length) this.currentIndex = 0

    const basePath = import.meta.env.BASE_URL || '/'
    this.bgAudio.src = `${basePath}mp3/${this.playlist[this.currentIndex]}`
    this.bgAudio.volume = this.musicVolume
    try {
      await this.bgAudio.play()
    } catch (err) {
      console.warn('Auto-play prevented; user gesture required to start music:', err)
    }
  }

  _onTrackEnded() {
    if (!this.isMusicEnabled) return
    // advance to next track
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length
    // start next track
    if (this.bgAudio) {
      const basePath = import.meta.env.BASE_URL || '/'
      this.bgAudio.src = `${basePath}mp3/${this.playlist[this.currentIndex]}`
      // play may need user gesture; try
      this.bgAudio.play().catch(e => {})
    }
  }

  stopCurrentPlayback() {
    try {
      if (this.bgAudio) {
        this.bgAudio.pause()
        this.bgAudio.currentTime = 0
      }
    } catch (e) {}
  }

  stopBackgroundMusic() {
    this.isMusicEnabled = false
    this.stopCurrentPlayback()
  }

  toggleBackgroundMusic() {
    if (this.isMusicEnabled) {
      this.stopBackgroundMusic()
    } else {
      this.isMusicEnabled = true
      this.startBackgroundMusic()
    }
    return this.isMusicEnabled
  }

  // Play next song in the playlist
  async nextSong() {
    if (!this.playlist || this.playlist.length === 0) return
    if (!this.isMusicEnabled) return

    this.currentIndex = (this.currentIndex + 1) % this.playlist.length
    if (!this.bgAudio) return this.startBackgroundMusic()

    const basePath = import.meta.env.BASE_URL || '/'
    this.bgAudio.src = `${basePath}mp3/${this.playlist[this.currentIndex]}`
    try { await this.bgAudio.play() } catch (e) {}
  }

  // Volume controls for background music
  increaseVolume(step = 0.1) {
    this.setVolume((this.musicVolume || 0) + step)
  }

  decreaseVolume(step = 0.1) {
    this.setVolume((this.musicVolume || 0) - step)
  }

  setVolume(value) {
    this.musicVolume = Math.min(1, Math.max(0, value))
    if (this.bgAudio) this.bgAudio.volume = this.musicVolume
    return this.musicVolume
  }

  getVolume() {
    return this.musicVolume
  }

  toggleSoundEffects() {
    this.isEnabled = !this.isEnabled
    return this.isEnabled
  }

  getSoundStatus() {
    return {
      soundEffects: this.isEnabled,
      backgroundMusic: this.isMusicEnabled,
      currentSong: this.playlist?.[this.currentIndex] || null,
      volume: this.musicVolume
    }
  }
}

// Create a singleton instance
const soundManager = new SoundManager()

export default soundManager