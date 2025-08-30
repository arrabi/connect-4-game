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
- Local two-player mode
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

## Technical Stack

This is a **client-side only** application built with:
- **React.js** - Component-based UI framework
- **Vite** - Fast build tool and dev server
- **CSS** - Styling with animations and responsive design
- **No Backend** - All game logic runs in the browser

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

Enjoy playing Connect 4 with friends and experience fun visual effects!
