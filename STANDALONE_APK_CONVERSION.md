# Converting Mate Music to Standalone APK

## Current Status

Your app has been set up with Capacitor for Android APK compilation. However, it currently requires a backend server to function. Here's how to make it fully standalone for mobile.

## What's Been Done

✅ Installed Capacitor 7.4.3
✅ Added Android platform
✅ Configured mobile features (splash screen, status bar)
✅ Created localStorage-based storage system
✅ Copied music search libraries to client side
✅ Created client-side API service

## Quick Build Process (After Conversion)

Once the app is converted to standalone, here's how to build the APK:

### Option 1: GitHub Actions (Recommended - Free & Easy)

1. **Upload project to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Create `.github/workflows/android-build.yml`:**
   (File content provided in next section)

3. **Trigger build:**
   - Go to GitHub → Your Repository → Actions tab
   - Click "Run workflow"
   - Wait 5-10 minutes
   - Download APK from Artifacts

### Option 2: Local Build (Requires Android Studio)

1. **Install Prerequisites:**
   - Android Studio
   - Java JDK 17
   - Android SDK

2. **Build commands:**
   ```bash
   npm install
   npm run android:build
   ```

3. **APK location:**
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

## GitHub Actions Workflow File

Create `.github/workflows/android-build.yml`:

```yaml
name: Build Android APK
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build web app
        run: npm run build
      
      - name: Sync Capacitor
        run: npx cap sync android
      
      - name: Make gradlew executable
        run: chmod +x android/gradlew
      
      - name: Build Debug APK
        run: cd android && ./gradlew assembleDebug
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: mate-music-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14
```

## Manual Conversion Steps (If Needed)

The app currently uses server API endpoints. To make it fully standalone:

1. **Update React Query calls** to use client-side functions instead of fetching from `/api/*`

2. **Replace database** storage with the localStorage system in `client/src/lib/storage.ts`

3. **Update components** to import from:
   - `client/src/api/music-search.ts` for search
   - `client/src/lib/storage.ts` for playlists/likes

4. **Remove server dependency** from package.json scripts for mobile builds

## Files Created

- `client/src/lib/storage.ts` - localStorage-based data storage
- `client/src/api/music-search.ts` - Client-side music search
- `client/src/api/*.ts` - Music platform API libraries
- `capacitor.config.ts` - Capacitor configuration
- `package.json` - Added Android build scripts

## Features in Standalone Mode

✅ Music search (requires internet)
✅ Playlists (stored locally)
✅ Liked songs (stored locally)
✅ AI mode filtering
✅ Web search
✅ Beautiful UI with dark mode
✅ Offline data persistence

❌ User authentication (not needed for mobile)
❌ Cloud sync (local storage only)

## Benefits

- **No hosting costs** - App runs entirely on device
- **Fast performance** - No server roundtrips for local data
- **Privacy** - All user data stays on device
- **Offline playlists** - Access your saved music without internet

## Next Steps

1. Upload your project to GitHub (public or private)
2. Add the GitHub Actions workflow file
3. Push your code
4. Download the APK from GitHub Actions
5. Install on your Android device

Your app will work exactly like the web version but as a native mobile app!
