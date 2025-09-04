import pkg from '@tonejs/midi'
const { Midi } = pkg
import fs from 'fs'

// Test parsing a MIDI file
const midiFile = './public/midi/PineappleRag.mid'
const arrayBuffer = fs.readFileSync(midiFile)

try {
  const midi = new Midi(arrayBuffer)
  console.log('MIDI name:', midi.name)
  console.log('Number of tracks:', midi.tracks.length)
  
  if (midi.tracks.length > 0) {
    const track = midi.tracks[0]
    console.log('Track name:', track.name)
    console.log('Number of notes in first track:', track.notes.length)
    
    if (track.notes.length > 0) {
      console.log('First few notes:', track.notes.slice(0, 5).map(note => ({
        name: note.name,
        time: note.time,
        duration: note.duration
      })))
    }
  }
} catch (error) {
  console.error('Error parsing MIDI:', error)
}