// Sound Manager for Connect 4 Game
// Uses Data URLs for sound effects to avoid external dependencies
import * as Tone from 'tone'

class SoundManager {
  constructor() {
    this.sounds = {}
    this.isEnabled = true
    this.isMusicEnabled = true
    this.backgroundMusic = null
    this.currentSong = null
    this.midiFiles = []
    this.synth = null
    this.currentPart = null
    this.initializeSounds()
    this.initializeMIDI()
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

  // Initialize MIDI system
  async initializeMIDI() {
    // Initialize Tone.js synthesizer
    this.synth = new Tone.PolySynth().toDestination()
    
    // Load available MIDI files
    await this.loadMIDIFiles()
  }

  // Load MIDI files from public/midi folder
  async loadMIDIFiles() {
    try {
      // List of MIDI files to try loading
      const potentialFiles = ['sample1.json', 'sample2.json', 'sample3.json']
      this.midiFiles = []
      const basePath = import.meta.env.BASE_URL || '/'

      for (const fileName of potentialFiles) {
        try {
          const response = await fetch(`${basePath}midi/${fileName}`)
          if (response.ok) {
            const midiData = await response.json()
            this.midiFiles.push({ fileName, data: midiData })
          }
        } catch (error) {
          console.warn(`Failed to load MIDI file ${fileName}:`, error)
        }
      }

      console.log(`Loaded ${this.midiFiles.length} MIDI files`)
    } catch (error) {
      console.warn('Failed to load MIDI files:', error)
    }
  }

  // Get a random MIDI file
  getRandomMIDIFile() {
    if (this.midiFiles.length === 0) {
      return null
    }
    const randomIndex = Math.floor(Math.random() * this.midiFiles.length)
    return this.midiFiles[randomIndex]
  }

  // Convert note name to frequency
  noteToFreq(noteName) {
    return Tone.Frequency(noteName).toFrequency()
  }

  playSound(soundName) {
    if (!this.isEnabled || !this.sounds[soundName]) return
    
    try {
      this.sounds[soundName]()
    } catch (error) {
      console.warn('Failed to play sound:', error)
    }
  }

  // MIDI Background music functionality
  async startBackgroundMusic() {
    if (!this.isMusicEnabled) return
    
    try {
      // Start Tone.js audio context
      await Tone.start()
      
      // Play a random MIDI file
      await this.playRandomMIDI()
      
    } catch (error) {
      console.warn('Failed to start background music:', error)
    }
  }

  async playRandomMIDI() {
    if (!this.isMusicEnabled) return

    const midiFile = this.getRandomMIDIFile()
    if (!midiFile) {
      console.warn('No MIDI files available')
      return
    }

    this.currentSong = midiFile
    await this.playMIDIFile(midiFile.data)
  }

  async playMIDIFile(midiData) {
    try {
      // Stop current playback
      this.stopCurrentPlayback()

      if (!midiData.tracks || midiData.tracks.length === 0) {
        console.warn('Invalid MIDI data')
        return
      }

      // Convert MIDI data to Tone.js Part
      const notes = midiData.tracks[0].notes.map(note => ({
        time: note.time,
        note: note.note,
        duration: note.duration
      }))

      this.currentPart = new Tone.Part((time, note) => {
        if (this.isMusicEnabled && this.synth) {
          this.synth.triggerAttackRelease(note.note, note.duration, time)
        }
      }, notes)

      // Set up looping and start playback
      this.currentPart.loop = true
      this.currentPart.loopEnd = notes.reduce((max, note) => 
        Math.max(max, note.time + note.duration), 0
      )
      
      // Schedule next song when this one ends
      this.currentPart.callback = () => {
        if (this.isMusicEnabled) {
          setTimeout(() => this.playRandomMIDI(), 1000)
        }
      }

      this.currentPart.start()
      Tone.Transport.start()

      console.log(`Playing: ${this.currentSong?.data?.name || 'Unknown song'}`)
      
    } catch (error) {
      console.warn('Failed to play MIDI file:', error)
    }
  }

  stopCurrentPlayback() {
    if (this.currentPart) {
      this.currentPart.stop()
      this.currentPart.dispose()
      this.currentPart = null
    }
  }

  stopBackgroundMusic() {
    this.isMusicEnabled = false
    this.stopCurrentPlayback()
    
    if (Tone.Transport.state === 'started') {
      Tone.Transport.stop()
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

  // Play next song
  async nextSong() {
    if (!this.isMusicEnabled) return
    
    console.log('Playing next song...')
    await this.playRandomMIDI()
  }

  toggleSoundEffects() {
    this.isEnabled = !this.isEnabled
    return this.isEnabled
  }

  getSoundStatus() {
    return {
      soundEffects: this.isEnabled,
      backgroundMusic: this.isMusicEnabled,
      currentSong: this.currentSong?.data?.name || null
    }
  }
}

// Create a singleton instance
const soundManager = new SoundManager()

export default soundManager