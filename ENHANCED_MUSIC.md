# Enhanced Background Music - Public Domain Melodies

## Overview
The Connect 4 game now features enhanced background music using famous public domain melodies, similar to classic game music like the Tetris theme. The system now supports both embedded melodies and external MIDI files for maximum variety and extensibility.

## Featured Melodies

### MIDI Files (New!)
1. **Twinkle, Twinkle, Little Star** - Traditional nursery rhyme
2. **Happy Birthday** - Mildred and Patty Hill (public domain as of 2016) 
3. **Mary Had a Little Lamb** - Traditional children's song

### Embedded Melodies
1. **Korobeiniki (Tetris Theme A)** - Russian folk song
2. **Ode to Joy** - Ludwig van Beethoven's 9th Symphony (composed 1824)
3. **Für Elise** - Ludwig van Beethoven (composed ~1810)
4. **Greensleeves** - Traditional English ballad (16th century)
5. **Canon in D** - Johann Pachelbel (composed ~1680)

## Technical Implementation
- **MIDI Support**: JSON-based MIDI files loaded dynamically from `/public/midi/` directory
- **Web Audio Synthesis**: All melodies (MIDI and embedded) are played using Web Audio API
- **Automatic Rotation**: Melodies rotate every 6 measures for variety
- **Fallback System**: If MIDI files fail to load, embedded melodies are used
- **Enhanced Bass Patterns**: Complementary bass lines for both MIDI and embedded melodies
- **No External Dependencies**: All audio generation uses native Web Audio API

## File Structure
```
public/
├── midi/
│   ├── twinkle_star.json
│   ├── happy_birthday.json
│   └── mary_lamb.json
src/
├── utils/
│   ├── soundManager.js (enhanced)
│   └── midiLoader.js (new)
```

## User Experience
- Players can toggle background music on/off using the 🎵/🎶 button
- Melodies provide a more engaging and nostalgic gaming experience
- Mix of familiar children's songs and classical pieces ensures broad appeal
- Console logging shows which melody is currently playing for debugging

## Adding New MIDI Files
To add new public domain melodies:
1. Create a JSON file in `/public/midi/` with the melody data
2. Add the filename to the `midiFiles` array in `midiLoader.js`
3. Follow the JSON format with `notes` (frequencies) and `durations` arrays