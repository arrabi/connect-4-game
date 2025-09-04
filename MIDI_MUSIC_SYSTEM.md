# MIDI Music System Documentation

## Overview
The Connect 4 game now features a modern MIDI-based music system that replaces the previous built-in melody generation. The system provides dynamic background music with user controls for play, pause, and next song functionality.

## Features

### MIDI File Support
- Automatically scans `public/midi/` folder for JSON-based MIDI files
- Supports multiple tracks and notes
- Random selection algorithm for variety
- Automatic song transitions when tracks end

### User Controls
- **Play/Pause**: Toggle background music on/off (🎵/🎶)
- **Next Song**: Skip to a random new track (⏭️)
- **Current Song Display**: Shows the name of the currently playing track
- **Sound Effects**: Independent control for game sound effects (🔊/🔇)

### Sample MIDI Files
The system includes three sample compositions:
1. **Happy Melody** - Upbeat major scale progression
2. **Playful Tune** - Quick, energetic melody in D major
3. **Gentle Breeze** - Smooth, flowing composition in F major

## Technical Implementation

### Dependencies
- **Tone.js**: Web Audio API wrapper for audio synthesis
- **@tonejs/midi**: MIDI file parsing and handling

### Architecture
- `soundManager.js`: Core audio management
- `SoundControls.jsx`: React component for UI controls
- JSON-based MIDI format for easy file management
- Dynamic base URL handling for deployment flexibility

### File Format
MIDI files are stored as JSON with the following structure:
```json
{
  "name": "Song Name",
  "tracks": [{
    "notes": [
      {"note": "C4", "time": 0, "duration": 0.5}
    ]
  }]
}
```

## User Experience
- Seamless integration with existing game interface
- Responsive design adapts to mobile devices
- Automatic music start on first user interaction
- Visual feedback for all control states
- Non-intrusive current song display

## Future Enhancements
- Support for standard MIDI (.mid) files
- Volume control slider
- Playlist management
- User-uploaded MIDI files
- Extended sample library