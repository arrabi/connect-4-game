# Connect 4 Game - GitHub Copilot Instructions

**CRITICAL: Always follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Repository Overview
Connect 4 Game is a client-side React.js web application built with Vite. It supports 2-player local gameplay, AI opponents with three difficulty levels, and AI vs AI mode. The app is deployed automatically to GitHub Pages and requires no backend server.

## Essential Setup & Build Commands

### Prerequisites
- Node.js 18+ (tested with v20.19.4)
- npm 8+ (tested with v10.8.2)

### Bootstrap the Repository
Always run these commands in this exact order after a fresh clone:

```bash
npm install
```
**Timing:** ~5 seconds. Never requires timeouts >30 seconds.

### Build Commands
```bash
# Development build and server
npm run dev
```
**Timing:** ~200ms startup. Serves at http://localhost:3000/connect-4-game/
**NEVER CANCEL:** This is instant. No timeout needed.

```bash
# Production build
npm run build
```
**Timing:** ~1.5 seconds consistently. Outputs to `dist/` folder.
**NEVER CANCEL:** This is very fast. Use timeout of 60 seconds maximum.

```bash
# Preview production build
npm run preview
```
**Timing:** ~200ms startup. Serves at http://localhost:4173/connect-4-game/
**NEVER CANCEL:** This is instant. No timeout needed.

### Deployment
```bash
# Build and deploy to GitHub Pages (requires gh-pages setup)
npm run deploy
```
**Note:** Automatic deployment is configured via GitHub Actions on push to main branch.

## Development Workflow

### Critical Paths and URLs
- **Development server:** http://localhost:3000/connect-4-game/
- **Preview server:** http://localhost:4173/connect-4-game/
- **Live deployment:** https://arrabi.github.io/connect-4-game

### Important: Base Path Configuration
The app is configured with base path `/connect-4-game/` for GitHub Pages. Always include this path when accessing locally or the app will not load correctly.

## Testing & Validation Requirements

### No Test Suite Available
**CRITICAL:** This repository has no automated test suite or linting configuration. Manual validation is required for all changes.

### Manual Validation Scenarios
**ALWAYS** run through these complete scenarios after making any changes:

#### Scenario 1: Two-Player Gameplay
1. Start development server with `npm run dev`
2. Navigate to http://localhost:3000/connect-4-game/
3. Ensure "👥 2 Players" mode is selected (default)
4. Click any column to drop a red disc
5. Verify disc appears at bottom of column
6. Verify turn indicator changes to "Yellow Player's Turn"
7. Click another column for yellow player
8. Verify disc drops and turn switches back to red
9. Complete a game by getting 4 in a row (horizontal, vertical, or diagonal)
10. Verify win detection and celebration animation

#### Scenario 2: AI Gameplay Validation
1. Click "🤖 vs AI" button
2. Verify AI difficulty selector appears with Easy/Medium/Hard options
3. Test each difficulty level:
   - **Easy:** AI makes random moves
   - **Medium:** AI blocks obvious wins and makes strategic moves
   - **Hard:** AI uses advanced strategy (minimax algorithm)
4. Make a move and verify AI responds automatically
5. Verify game timer is working and incrementing

#### Scenario 3: UI Controls Validation
1. Test "🔄 New Game" button - should reset board
2. Test "🏆 Leaderboard" button - should open stats modal
3. Test "📝 Set Name" buttons - should open player setup modal
4. Test sound controls (🔊 🎵) - buttons should toggle
5. Test "📱 Share" button - should open share modal
6. Test "Hide Controls" toggle - should collapse/expand controls

#### Scenario 4: Production Build Validation
1. Run `npm run build` 
2. Run `npm run preview`
3. Navigate to http://localhost:4173/connect-4-game/
4. Repeat Scenario 1 to ensure production build works identically
5. Verify assets load correctly (no 404s in browser console)

### Browser Console Warnings
**Expected:** You will see AudioContext warnings in the browser console during automated testing. These are normal and do not indicate application issues - they occur because browsers require user interaction to start audio.

## Important File Locations

### Core Application Files
- `src/App.jsx` - Main application component and game state
- `src/components/GameBoard.jsx` - Game board grid and click handling
- `src/utils/gameLogic.js` - Win detection and game rules
- `src/utils/aiLogic.js` - AI implementation (Easy/Medium/Hard)
- `vite.config.js` - Build configuration with GitHub Pages base path

### Configuration Files
- `package.json` - Dependencies and npm scripts
- `.github/workflows/deploy.yml` - GitHub Actions auto-deployment
- `index.html` - HTML template with SEO metadata

### Documentation
- `README.md` - User-facing documentation and setup
- `DEPLOYMENT.md` - GitHub Pages deployment guide
- `game_spec.md` - Product requirements and technical specifications

## AI Implementation Details
The AI system implements three difficulty levels:
- **Easy:** Random move selection from valid columns
- **Medium:** Rule-based heuristics (blocks opponent wins, creates own winning opportunities)
- **Hard:** Minimax algorithm with Alpha-Beta pruning and 6-move lookahead depth

## Common Development Tasks

### Making UI Changes
1. Edit files in `src/components/` for component changes
2. Edit `src/App.css` or component-specific CSS files for styling
3. Always test in both dev and preview modes
4. Always validate with complete gameplay scenarios

### Modifying Game Logic
1. Edit `src/utils/gameLogic.js` for game rules
2. Edit `src/utils/aiLogic.js` for AI behavior changes
3. Test all three AI difficulty levels thoroughly
4. Verify win detection works in all directions (horizontal, vertical, diagonal)

### Adding New Features
1. Create new components in `src/components/`
2. Import and integrate in `src/App.jsx`
3. Add corresponding CSS files
4. Test new features in all game modes (2-player, vs AI, AI vs AI)

## Deployment & CI

### Automatic Deployment
- Pushes to `main` branch trigger automatic GitHub Actions deployment
- Build artifacts are deployed to GitHub Pages
- Check `.github/workflows/deploy.yml` for deployment configuration
- Monitor deployment status in GitHub Actions tab

### Manual Deployment
If needed, you can deploy manually:
```bash
npm run deploy
```
**Requirement:** Must have `gh-pages` branch and GitHub Pages configured.

## Build Output Analysis
- **Total build size:** ~147KB optimized
- **CSS:** ~29KB (gzipped: ~5KB)
- **JavaScript:** ~180KB (gzipped: ~57KB)
- **Build artifacts:** Saved to `dist/` folder
- **Assets include:** HTML, CSS, JS bundles, MIDI files, and QR code SVG

## Performance Notes
- Very fast build times (< 2 seconds) - no need for long timeouts
- Instant development server startup
- Client-side only - no server-side dependencies
- Responsive design works on desktop and mobile devices
- Audio files (MIDI) included for background music

## Troubleshooting
- **App not loading:** Verify you're accessing correct URL with base path
- **Build fails:** Check Node.js version compatibility (requires 18+)
- **Audio warnings:** Normal in automated testing environments
- **Deployment issues:** Check GitHub Actions logs and Pages configuration