// Sound Manager for Connect 4 Game
// Uses Web Audio API to play simple synthesized notes for MIDI playback.
// Uses @tonejs/midi only for parsing MIDI files.
import { Midi } from '@tonejs/midi'

class SoundManager {
  constructor() {
  this.sounds = {}
  this.isEnabled = true
  // Start with background music disabled to avoid browser autoplay restrictions.
  // Music will be started by a user gesture (e.g. pressing the music button).
  this.isMusicEnabled = false
  this.backgroundMusic = null
  this.currentSong = null
  this.midiFiles = []
  // WebAudio resources (created lazily)
  this.audioContext = null
  this.masterGain = null
  this.playingNodes = [] // track active oscillators/gains for stop
  this.currentTimers = [] // track timers for scheduling loop/next song
  this.initializeSounds()
  this.initializeMIDI()
  }

  // Simple sound generation using Web Audio API
  generateTone(frequency, duration, type = 'sine') {
    if (!this.isEnabled) return null

    try {
      // Ensure a shared AudioContext exists (created lazily)
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.masterGain = this.audioContext.createGain()
        this.masterGain.gain.value = 0.4
        this.masterGain.connect(this.audioContext.destination)
      } else if (this.audioContext.state === 'suspended') {
        try {
          this.audioContext.resume()
        } catch (e) {
          // ignore
        }
      }

      const now = this.audioContext.currentTime
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, now)

      gainNode.gain.setValueAtTime(0.0001, now)
      gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain)

      oscillator.start(now)
      oscillator.stop(now + duration + 0.02)

      // Track nodes briefly so they can be stopped if needed
      this.playingNodes.push({ oscillator, gainNode })

      // Clean up after stop
      setTimeout(() => {
        try {
          oscillator.disconnect()
          gainNode.disconnect()
        } catch (e) {}
        this.playingNodes = this.playingNodes.filter(n => n.oscillator !== oscillator)
      }, (duration + 0.1) * 1000)

      return { oscillator, gainNode }
    } catch (error) {
      console.warn('Web Audio API not supported or blocked:', error)
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
  // Load available MIDI files. Do NOT create audio nodes here.
  await this.loadMIDIFiles()
  }

  // Load MIDI files from public/midi folder
  async loadMIDIFiles() {
    try {
      // List of MIDI files to try loading
      const potentialFiles = [
        'EliteSyncopations.mid',
        'Fairouz_-_Addaysh_kan_fi_nas.mid', 
        'Fairouz_-_Nassam_3alayna_al_Hawa.mid',
        'PineappleRag.mid',
        'TheStrenuousLife.mid',
        'music-a-music-b-loaded-remix-.mid'
      ]
      this.midiFiles = []
      const basePath = import.meta.env.BASE_URL || '/'

      for (const fileName of potentialFiles) {
        try {
          const response = await fetch(`${basePath}midi/${fileName}`)
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer()
            const midi = new Midi(arrayBuffer)
            
            // Convert MIDI data to the format expected by playMIDIFile
            const midiData = {
              name: midi.name || fileName.replace('.mid', ''),
              tracks: midi.tracks.map(track => ({
                name: track.name,
                notes: track.notes.map(note => ({
                  note: note.name,
                  time: note.time,
                  duration: note.duration
                }))
              }))
            }
            
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
    // Convert note name like C4 to MIDI number and then to frequency.
    const midi = this.noteNameToMidi(noteName)
    if (midi == null) return 440
    return 440 * Math.pow(2, (midi - 69) / 12)
  }

  noteNameToMidi(noteName) {
    // Examples: C4, C#4, Db3
    const m = String(noteName).match(/^([A-Ga-g])([#b]?)(-?\d+)$/)
    if (!m) return null
    const note = m[1].toUpperCase()
    const accidental = m[2]
    const octave = parseInt(m[3], 10)
    const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[note]
    let semitone = base
    if (accidental === '#') semitone += 1
    if (accidental === 'b') semitone -= 1
    const midi = (octave + 1) * 12 + (semitone % 12 + 12) % 12
    return midi
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
      // Create or resume AudioContext (must be called after user gesture)
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.masterGain = this.audioContext.createGain()
        this.masterGain.gain.value = 0.4
        this.masterGain.connect(this.audioContext.destination)
      } else if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // Start playback
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

      const notes = midiData.tracks[0].notes.map(note => ({
        time: note.time,
        note: note.note,
        duration: note.duration
      }))

      if (!this.audioContext) {
        // If audio context isn't available, create it (may be suspended until user gesture)
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.masterGain = this.audioContext.createGain()
        this.masterGain.gain.value = 0.4
        this.masterGain.connect(this.audioContext.destination)
      } else if (this.audioContext.state === 'suspended') {
        // Resume if suspended (may happen if AudioContext was created earlier without a user gesture)
        try {
          await this.audioContext.resume()
        } catch (e) {
          console.warn('Failed to resume AudioContext before scheduling notes:', e)
        }
      }

      // Schedule each note using Web Audio Oscillators
      const now = this.audioContext.currentTime
      let loopEnd = 0
      notes.forEach(note => {
        const start = now + note.time
        const stop = start + (note.duration || 0.5)
        loopEnd = Math.max(loopEnd, note.time + (note.duration || 0.5))

        const freq = this.noteToFreq(note.note)
        const osc = this.audioContext.createOscillator()
        const gain = this.audioContext.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, start)

        gain.gain.setValueAtTime(0.0001, start)
        gain.gain.exponentialRampToValueAtTime(0.3, start + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.0001, stop)

        osc.connect(gain)
        gain.connect(this.masterGain)

        osc.start(start)
        osc.stop(stop + 0.02)

        this.playingNodes.push({ osc, gain })
      })

      // Schedule next song after the loop ends
      const timerId = setTimeout(() => {
        if (this.isMusicEnabled) {
          this.playRandomMIDI()
        }
      }, (loopEnd + 1) * 1000)
      this.currentTimers.push(timerId)

      console.log(`Playing: ${this.currentSong?.data?.name || 'Unknown song'}`)
      
    } catch (error) {
      console.warn('Failed to play MIDI file:', error)
    }
  }

  stopCurrentPlayback() {
    // Stop and disconnect any scheduled oscillators
    try {
      this.playingNodes.forEach(n => {
        try { n.osc.stop?.() } catch (e) {}
        try { n.osc.disconnect?.() } catch (e) {}
        try { n.gain.disconnect?.() } catch (e) {}
      })
    } catch (e) {}
    this.playingNodes = []

    // Clear any scheduled timers
    this.currentTimers.forEach(id => clearTimeout(id))
    this.currentTimers = []
  }

  stopBackgroundMusic() {
    this.isMusicEnabled = false
    this.stopCurrentPlayback()

    // Optionally suspend the AudioContext to free resources
    try {
      if (this.audioContext && this.audioContext.state === 'running') {
        this.audioContext.suspend()
      }
    } catch (e) {}
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