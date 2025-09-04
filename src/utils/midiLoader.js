// MIDI Loader for Connect 4 Game
// Loads and parses JSON-based MIDI files for background music

class MidiLoader {
  constructor() {
    this.midiFiles = [
      'twinkle_star.json',
      'happy_birthday.json', 
      'mary_lamb.json'
    ]
    this.loadedMelodies = []
    this.isLoading = false
  }

  // Convert MIDI data to the soundManager melody format
  convertMidiToMelody(midiData) {
    if (!midiData.tracks || midiData.tracks.length === 0) {
      throw new Error('Invalid MIDI data: no tracks found')
    }

    const melodyTrack = midiData.tracks.find(track => track.name === 'melody') || midiData.tracks[0]
    
    // Sort notes by start time
    const sortedNotes = melodyTrack.notes.sort((a, b) => a.start - b.start)
    
    const notes = sortedNotes.map(note => note.frequency)
    const durations = sortedNotes.map(note => note.duration)
    
    return {
      title: midiData.title,
      composer: midiData.composer,
      notes: notes,
      durations: durations,
      type: 'sine', // Default oscillator type
      tempo: midiData.tempo || 120,
      originalData: midiData
    }
  }

  // Load a single MIDI file
  async loadMidiFile(filename) {
    try {
      const response = await fetch(`/connect-4-game/midi/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load MIDI file: ${filename}`)
      }
      
      const midiData = await response.json()
      return this.convertMidiToMelody(midiData)
    } catch (error) {
      console.warn(`Error loading MIDI file ${filename}:`, error)
      return null
    }
  }

  // Load all MIDI files
  async loadAllMidiFiles() {
    if (this.isLoading) return this.loadedMelodies
    
    this.isLoading = true
    
    try {
      const loadPromises = this.midiFiles.map(filename => this.loadMidiFile(filename))
      const results = await Promise.all(loadPromises)
      
      // Filter out failed loads
      this.loadedMelodies = results.filter(melody => melody !== null)
      
      console.log(`Loaded ${this.loadedMelodies.length} MIDI melodies:`, 
        this.loadedMelodies.map(m => m.title))
      
      return this.loadedMelodies
    } catch (error) {
      console.warn('Error loading MIDI files:', error)
      return []
    } finally {
      this.isLoading = false
    }
  }

  // Get a random melody from loaded MIDI files
  getRandomMelody() {
    if (this.loadedMelodies.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * this.loadedMelodies.length)
    return this.loadedMelodies[randomIndex]
  }

  // Get all loaded melodies
  getAllMelodies() {
    return this.loadedMelodies
  }

  // Get melody by title
  getMelodyByTitle(title) {
    return this.loadedMelodies.find(melody => 
      melody.title.toLowerCase().includes(title.toLowerCase())
    )
  }
}

// Create singleton instance
const midiLoader = new MidiLoader()

export default midiLoader