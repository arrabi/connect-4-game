# Connect 4 Game

[![Deploy to GitHub Pages](https://github.com/arrabi/connect-4-game/actions/workflows/deploy.yml/badge.svg)](https://github.com/arrabi/connect-4-game/actions/workflows/deploy.yml)

A client-side web app for playing Connect 4 in the browser. This is a pure frontend application with no server requirements - all game logic runs locally in your browser.

## 📱 Quick Play - Scan QR Code

<div align="center">

**Scan to play instantly on your phone!**

<img src="qr-code.svg" alt="QR Code for Connect 4 Game" width="200" height="200" style="max-width: 100%; height: auto;">

**🔗 [Play Now: https://arrabi.github.io/connect-4-game](https://arrabi.github.io/connect-4-game)**

</div>

## Features

- **Client-Only Architecture** - No server needed, runs entirely in the browser
- Classic Connect 4 gameplay with 7x6 grid
- **AI Opponent** - Play against computer with 3 difficulty levels
- Local two-player mode
- **Smart AI Difficulties:**
  - **Easy**: Random moves - perfect for beginners
  - **Medium**: Strategic play - blocks wins and creates opportunities
  - **Hard**: Advanced Minimax algorithm - maximum challenge
- Animated disc drop effects and visual feedback
- **Enhanced Winning Visual Effects** - Color-coordinated glow and pulse animations for winning discs
- Responsive design for desktop and mobile
- Win detection (horizontal, vertical, diagonal)
- Game reset functionality
- Immersive visual effects without distracting overlays

## Getting Started

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd connect-4-game
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open your browser and navigate to the local development URL to start playing!

## How to Play

### Game Modes
- **👥 2 Players**: Classic local multiplayer - take turns on the same device
- **🤖 vs AI**: Play against the computer with selectable difficulty

### AI Difficulties
- **😊 Easy**: AI makes random moves - great for learning the game
- **😐 Medium**: AI uses basic strategy - blocks your wins and tries to create its own
- **😈 Hard**: AI uses advanced Minimax algorithm - provides maximum challenge

### Gameplay
1. Choose your game mode using the selector at the top
2. If playing vs AI, select your preferred difficulty level
3. Drop discs by clicking on the columns
4. Get 4 in a row (horizontal, vertical, or diagonal) to win!
5. Use the "New Game" button to reset and start over

## Technical Stack

This is a **client-side only** application built with:
- **React.js** - Component-based UI framework
- **Vite** - Fast build tool and dev server
- **CSS** - Styling with animations and responsive design
- **No Backend** - All game logic runs in the browser

### AI Implementation
The AI opponent uses different algorithms based on difficulty:
- **Easy**: Random move selection
- **Medium**: Rule-based heuristics (win detection, blocking)
- **Hard**: Minimax algorithm with Alpha-Beta pruning (6-move lookahead)

## Deployment

### 🚀 GitHub Pages (Automatic Deployment)

This project automatically deploys to GitHub Pages on every push to the main branch.

#### Setup (One-time):
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set source to "GitHub Actions"
4. Every push to main will automatically deploy!

**Live Demo:** [https://arrabi.github.io/connect-4-game](https://arrabi.github.io/connect-4-game)

### Other Hosting Options

Since this is a static web app, it can also be deployed to:
- **Netlify** - Drag & drop the `dist` folder
- **Vercel** - Connect your GitHub repository  
- **AWS S3** - Upload `dist` folder to S3 bucket
- **Any web server** - Serve the `dist` folder as static files

#### Build for other platforms:
```bash
npm run build
# Upload the 'dist' folder to your hosting service
```

## About

Connect 4 is a two-player connection game in which the players first choose a color and then take turns dropping colored discs into a seven-column, six-row vertically suspended grid. The pieces fall straight down, occupying the lowest available space within the column. The objective is to be the first to form a horizontal, vertical, or diagonal line of four of one's own discs.

This implementation features both classic 2-player local gameplay and single-player mode against an AI opponent with three difficulty levels. The AI uses different strategies:

- **Easy AI**: Makes random valid moves
- **Medium AI**: Uses basic game theory - blocks opponent wins and creates winning opportunities  
- **Hard AI**: Implements Minimax algorithm with Alpha-Beta pruning for optimal strategic play

Enjoy playing Connect 4 with friends or challenge yourself against the AI!
