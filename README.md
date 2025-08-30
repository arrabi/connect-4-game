# Connect 4 Game

A client-side web app for playing Connect 4 in the browser. This is a pure frontend application with no server requirements - all game logic runs locally in your browser.

## 📱 Quick Play - Scan QR Code

<div align="center">

**Scan to play instantly on your phone!**

![QR Code](qr-code.svg)

**🔗 [Play Now: https://arrabi.github.io/connect-4-game](https://arrabi.github.io/connect-4-game)**

</div>

## Features

- **Client-Only Architecture** - No server needed, runs entirely in the browser
- Classic Connect 4 gameplay with 7x6 grid
- Local two-player mode
- Animated disc drop effects and visual feedback
- Responsive design for desktop and mobile
- Win detection (horizontal, vertical, diagonal)
- Game reset functionality
- Fun and interactive visual effects

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

### 🚀 GitHub Pages (Recommended)

This project is configured for easy deployment to GitHub Pages with automatic builds.

#### Option 1: Automatic Deployment (Recommended)
1. Push your code to GitHub
2. Go to your repository settings → Pages
3. Set source to "GitHub Actions"
4. The workflow will automatically build and deploy on every push to main

#### Option 2: Manual Deployment
```bash
# Install dependencies (if not already done)
npm install

# Build and deploy to GitHub Pages
npm run deploy
```

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
