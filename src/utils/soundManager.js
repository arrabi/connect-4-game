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
    
    // Create an exciting dynamic background music using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
      
      // Create musical tone with envelope and effects
      const createMusicalTone = (freq, startTime, duration, type = 'sine', volume = 0.15, envelope = 'smooth') => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, startTime)
        oscillator.type = type
        
        // Dynamic envelope based on type
        if (envelope === 'percussive') {
          gainNode.gain.setValueAtTime(0, startTime)
          gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
        } else if (envelope === 'smooth') {
          gainNode.gain.setValueAtTime(0, startTime)
          gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.1)
          gainNode.gain.linearRampToValueAtTime(volume * 0.8, startTime + duration - 0.2)
          gainNode.gain.linearRampToValueAtTime(0.01, startTime + duration)
        }
        
        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
        
        return oscillator
      }

      // Multiple exciting melody patterns
      const melodyPatterns = [
        // Pattern 1: Uplifting melody in C major
        {
          notes: [523.25, 659.25, 783.99, 659.25, 523.25, 587.33, 659.25, 523.25], // C5, E5, G5, E5, C5, D5, E5, C5
          durations: [0.4, 0.4, 0.8, 0.4, 0.4, 0.4, 0.4, 1.2],
          type: 'triangle'
        },
        // Pattern 2: Rhythmic ascending pattern
        {
          notes: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // C4 to C5
          durations: [0.3, 0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 1.0],
          type: 'sawtooth'
        },
        // Pattern 3: Descending melodic phrase
        {
          notes: [783.99, 659.25, 587.33, 523.25, 466.16, 392.00, 349.23, 523.25], // G5 down to F4, back to C5
          durations: [0.5, 0.3, 0.3, 0.6, 0.3, 0.3, 0.6, 1.2],
          type: 'triangle'
        }
      ]
      
      // Bass line patterns for harmony
      const bassPatterns = [
        [130.81, 164.81, 196.00, 164.81], // C3, E3, G3, E3
        [130.81, 146.83, 174.61, 130.81], // C3, D3, F3, C3
        [196.00, 164.81, 146.83, 130.81]  // G3, E3, D3, C3
      ]
      
      let currentPattern = 0
      let measureCount = 0
      
      const playMusicLoop = () => {
        if (!this.isMusicEnabled) return
        
        const pattern = melodyPatterns[currentPattern]
        const bassPattern = bassPatterns[currentPattern % bassPatterns.length]
        const currentTime = audioContext.currentTime
        let noteTime = 0
        
        // Play melody with dynamic expression
        pattern.notes.forEach((freq, index) => {
          const duration = pattern.durations[index]
          const volume = 0.12 + (Math.sin(measureCount * 0.5) * 0.03) // Dynamic volume
          
          createMusicalTone(
            freq, 
            currentTime + noteTime, 
            duration, 
            pattern.type, 
            volume, 
            'smooth'
          )
          noteTime += duration
        })
        
        // Add bass harmony
        bassPattern.forEach((freq, index) => {
          const bassTime = index * (noteTime / bassPattern.length)
          createMusicalTone(
            freq, 
            currentTime + bassTime, 
            noteTime / bassPattern.length * 0.8, 
            'sine', 
            0.08, 
            'smooth'
          )
        })
        
        // Add subtle percussion-like accents
        if (measureCount % 2 === 0) {
          createMusicalTone(130.81, currentTime, 0.1, 'square', 0.05, 'percussive') // Kick-like
          createMusicalTone(1760, currentTime + noteTime/2, 0.05, 'square', 0.03, 'percussive') // Hi-hat-like
        }
        
        measureCount++
        
        // Rotate patterns for variety
        if (measureCount % 4 === 0) {
          currentPattern = (currentPattern + 1) % melodyPatterns.length
        }
        
        // Schedule next loop
        setTimeout(() => {
          if (this.isMusicEnabled) {
            playMusicLoop()
          }
        }, noteTime * 1000 + 200) // Small gap between loops
      }
      
      playMusicLoop()
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