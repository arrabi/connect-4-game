// Sound Manager for Connect 4 Game
// Uses Data URLs for sound effects to avoid external dependencies

class SoundManager {
  constructor() {
    this.sounds = {}
    this.isEnabled = true
    this.isMusicEnabled = true
    this.backgroundMusic = null
    this.initializeSounds()
  }

  // Simple sound generation using Web Audio API
  generateTone(frequency, duration, type = 'sine') {
    if (!this.isEnabled) return null
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
      
      return { oscillator, gainNode, audioContext }
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
      return null
    }
  }

  initializeSounds() {
    // Create simple sound effects using Web Audio API
    this.sounds = {
      drop: () => this.generateTone(220, 0.3, 'sine'),
      win: () => this.generateWinSound(),
      lose: () => this.generateLoseSound(),
      draw: () => this.generateDrawSound()
    }
  }

  generateWinSound() {
    if (!this.isEnabled) return
    
    // Play ascending notes for victory
    const notes = [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.generateTone(freq, 0.4, 'sine')
      }, index * 150)
    })
  }

  generateLoseSound() {
    if (!this.isEnabled) return
    
    // Play descending notes for defeat
    const notes = [392.00, 329.63, 261.63, 196.00] // G4, E4, C4, G3
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.generateTone(freq, 0.4, 'square')
      }, index * 200)
    })
  }

  generateDrawSound() {
    if (!this.isEnabled) return
    
    // Play neutral tone for draw
    this.generateTone(293.66, 0.8, 'triangle') // D4
  }

  playSound(soundName) {
    if (!this.isEnabled || !this.sounds[soundName]) return
    
    try {
      this.sounds[soundName]()
    } catch (error) {
      console.warn('Failed to play sound:', error)
    }
  }

  // Background music functionality
  startBackgroundMusic() {
    if (!this.isMusicEnabled) return
    
    // Create a simple ambient background music using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
      
      // Create a simple ambient loop
      const createAmbientTone = (freq, startTime, duration) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, startTime)
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.1)
        gainNode.gain.linearRampToValueAtTime(0.05, startTime + duration - 0.1)
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
        
        return oscillator
      }

      // Create a simple melody loop
      const melodyNotes = [261.63, 293.66, 329.63, 349.23] // C4, D4, E4, F4
      const noteDuration = 2
      
      const playMelodyLoop = () => {
        if (!this.isMusicEnabled) return
        
        melodyNotes.forEach((freq, index) => {
          createAmbientTone(freq, audioContext.currentTime + index * noteDuration, noteDuration * 0.8)
        })
        
        // Schedule next loop
        setTimeout(() => {
          if (this.isMusicEnabled) {
            playMelodyLoop()
          }
        }, melodyNotes.length * noteDuration * 1000)
      }
      
      playMelodyLoop()
      this.backgroundMusic = { audioContext, stop: () => { this.isMusicEnabled = false } }
      
    } catch (error) {
      console.warn('Failed to start background music:', error)
    }
  }

  stopBackgroundMusic() {
    this.isMusicEnabled = false
    if (this.backgroundMusic) {
      this.backgroundMusic.stop()
      this.backgroundMusic = null
    }
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

  toggleSoundEffects() {
    this.isEnabled = !this.isEnabled
    return this.isEnabled
  }

  getSoundStatus() {
    return {
      soundEffects: this.isEnabled,
      backgroundMusic: this.isMusicEnabled
    }
  }
}

// Create a singleton instance
const soundManager = new SoundManager()

export default soundManager