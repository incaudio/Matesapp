# How to Get Your APK

Unfortunately, Replit doesn't have the Android SDK installed (it's several GB), so we can't build the APK directly here. However, **GitHub Actions will build it for you automatically and for FREE!**

## 🚀 Quick Steps to Get Your APK

### 1. Push Your Code to GitHub
If you haven't already, push this project to GitHub:

```bash
git init
git add .
git commit -m "mate search app with fullscreen mode and offline support"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. GitHub Actions Builds the APK Automatically
- The workflow file at `.github/workflows/android-build.yml` is already configured
- It will automatically run when you push to GitHub
- It builds both **Debug** and **Release** APKs

### 3. Download Your APK
1. Go to your GitHub repository
2. Click on the **"Actions"** tab at the top
3. Click on the latest workflow run
4. Scroll down to **"Artifacts"**
5. Download **`mate-search-debug.apk`**
6. Install it on your Android device!

## 📱 Features Included

Your APK now has:
- ✅ **Name:** "mate search" (lowercase as requested)
- ✅ **Fullscreen Mode:** No action bar, immersive display
- ✅ **Offline Support:** Service worker caches the app
- ✅ **PWA Manifest:** Can be installed as a web app too
- ✅ **Portrait Orientation:** Locked to portrait mode

## 🔧 Alternative: Build Locally

If you have Android Studio installed on your computer:

1. Download this project
2. Open Android Studio
3. Open the `android` folder as a project
4. Click **Build > Build Bundle(s) / APK(s) > Build APK(s)**
5. Find your APK in `android/app/build/outputs/apk/debug/`

## ⚠️ Important Notes

- The **debug APK** is unsigned and great for testing
- The **release APK** needs to be signed for distribution on Play Store
- No internet = no search results (as you requested)
- The app will show an offline page when there's no connection

## 🎯 What Changed

From your original request:
1. **App name:** Changed to "mate search" ✓
2. **Fullscreen:** Android app runs in fullscreen/immersive mode ✓
3. **Offline capable:** App loads offline, but search requires internet ✓

Enjoy your music search app! 🎵
