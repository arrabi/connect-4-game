# 🚀 GitHub Pages Deployment Guide

## ✅ Automatic Deployment (Already Configured!)

This repository is configured for **automatic deployment** to GitHub Pages:

### How it works:
1. **Push to main branch** → Automatic deployment triggers
2. **GitHub Actions** builds and deploys your app
3. **Live in ~2-3 minutes** at: https://arrabi.github.io/connect-4-game

### Setup Steps (One-time only):
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Set **Source** to "GitHub Actions"

### That's it! 🎉
- Every push to `main` automatically deploys
- Check the **Actions** tab to see deployment status
- Manual deployments also available via workflow dispatch

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
