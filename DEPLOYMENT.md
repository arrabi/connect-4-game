# 🚀 GitHub Pages Deployment Guide

## Quick Setup Steps

### 1. Push to GitHub
Make sure your code is pushed to a GitHub repository named `connect-4-game`.

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Set **Source** to "GitHub Actions"

### 3. Automatic Deployment
- The GitHub Actions workflow will automatically trigger on pushes to `main`
- Your game will be available at: `https://yourusername.github.io/connect-4-game`

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Make sure you have gh-pages installed
npm install

# Build and deploy in one command
npm run deploy
```

## What's Been Configured

✅ **Vite base path** - Set to `/connect-4-game/` for GitHub Pages  
✅ **GitHub Actions workflow** - Automatic build and deploy  
✅ **gh-pages package** - For manual deployment option  
✅ **Package.json scripts** - Deploy command added  
✅ **Homepage URL** - Points to GitHub Pages URL

## Troubleshooting

### If deployment fails:
1. Check that repository name matches the base path in `vite.config.js`
2. Ensure GitHub Actions has permissions (should be automatic)
3. Check the Actions tab for error details

### If paths don't work:
- Make sure the repository name is exactly `connect-4-game`
- If you have a different repo name, update `base` in `vite.config.js`

## Live URL
Once deployed, your game will be live at:
**https://arrabi.github.io/connect-4-game**

Enjoy your Connect 4 game! 🎮
