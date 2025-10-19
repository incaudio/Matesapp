# Android APK Build Guide for Mate Music

This guide explains how to build Mate Music as an Android APK that can be installed on Android devices.

## Overview

Mate Music has been configured with Capacitor, which allows the web application to be packaged as a native Android app. The app will run in a native WebView with access to device features like splash screens, status bar styling, and more.

## Prerequisites

Before you can build an APK, you need to set up your development environment:

### Required Software

1. **Android Studio** (Required for building APKs)
   - Download from: https://developer.android.com/studio
   - Install Android SDK Platform 33 or higher
   - Install Android Build Tools
   - Accept Android SDK licenses

2. **Java Development Kit (JDK) 17**
   - Android Studio includes a JDK, or download separately
   - Verify installation: `java -version`

3. **Node.js 20.x and npm 10.x** (Already installed in this project)

### Environment Setup

1. Set `ANDROID_HOME` environment variable:
   ```bash
   # On Linux/Mac (add to ~/.bashrc or ~/.zshrc)
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   
   # On Windows
   setx ANDROID_HOME "%USERPROFILE%\AppData\Local\Android\Sdk"
   ```

2. Verify Android setup:
   ```bash
   adb --version
   ```

## Building APK in Replit (Limited)

**Note:** Building APKs directly in Replit is not fully supported because Replit doesn't have Android Studio or the Android SDK installed. However, you can:

1. **Prepare the project** in Replit:
   ```bash
   npm run build
   npx cap sync android
   ```

2. **Download the project** to your local machine where Android Studio is installed

3. **Follow the local build instructions** below

## Building APK Locally

Once you have the prerequisites installed and the project downloaded to your local machine:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the Web App
```bash
npm run build
```

This creates the production build in `dist/public/` that will be bundled into the APK.

### Step 3: Sync with Android
```bash
npm run android:sync
```

This command:
- Builds the web app
- Copies the build to the Android project
- Updates native dependencies

### Step 4: Build Debug APK

**Option A: Using npm script (Recommended)**
```bash
npm run android:build
```

The debug APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Option B: Using Android Studio**
```bash
npm run android:open
```

This opens the project in Android Studio where you can:
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- Or use the "Run" button to install on a connected device/emulator

### Step 5: Build Release APK (For Distribution)

To create a signed release APK for publishing to Google Play Store or distributing:

1. **Generate a keystore** (first time only):
   ```bash
   cd android
   keytool -genkey -v -keystore mate-music.keystore -alias mate-music -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing** by creating `android/key.properties`:
   ```properties
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=mate-music
   storeFile=mate-music.keystore
   ```

3. **Update `android/app/build.gradle`** to use the keystore (see Android documentation)

4. **Build release APK**:
   ```bash
   npm run android:build:release
   ```

The release APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Installing the APK

### On Physical Device
1. Enable Developer Options and USB Debugging on your Android device
2. Connect device via USB
3. Run:
   ```bash
   npm run android:run
   ```

Or manually install:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### On Android Emulator
1. Open Android Studio → Device Manager
2. Create or start an emulator
3. Run:
   ```bash
   npm run android:run
   ```

### Direct Installation
1. Copy the APK file to your Android device
2. Enable "Install from Unknown Sources" in device settings
3. Open the APK file to install

## NPM Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run android:sync` | Build web app and sync to Android |
| `npm run android:open` | Open project in Android Studio |
| `npm run android:run` | Build, sync, and run on connected device |
| `npm run android:build` | Build debug APK |
| `npm run android:build:release` | Build release APK (requires signing setup) |

## Customization

### App Icon
Replace these files with your custom app icon:
- `android/app/src/main/res/mipmap-*/ic_launcher.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_round.png`

### Splash Screen
1. Create splash screen image at `android/app/src/main/res/drawable/splash.png`
2. The background color is configured in `capacitor.config.ts` (currently `#1a1625`)

### App Name
Change the app name in:
- `capacitor.config.ts` → `appName`
- `android/app/src/main/res/values/strings.xml` → `<string name="app_name">`

### Package Name
To change from `com.mate.music`:
1. Update `capacitor.config.ts` → `appId`
2. Update `android/app/build.gradle` → `applicationId`
3. Run `npx cap sync android`

### Permissions
Add permissions to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Troubleshooting

### "Android SDK not found"
- Install Android Studio
- Set `ANDROID_HOME` environment variable
- Add Android SDK tools to PATH

### "Gradle build failed"
- Open project in Android Studio
- Let it download dependencies
- Try building from Android Studio first

### "License not accepted"
```bash
# Accept all Android SDK licenses
cd $ANDROID_HOME/tools/bin
./sdkmanager --licenses
```

### APK size too large
The initial APK will be ~20-30MB due to WebView and assets. To reduce:
- Enable code splitting in Vite config
- Optimize images and assets
- Use Android App Bundle (.aab) instead of APK for Google Play

### App crashes on startup
- Check LogCat in Android Studio for errors
- Ensure `npm run build` completed successfully
- Verify `capacitor.config.ts` settings
- Check `android/app/src/main/AndroidManifest.xml` for permission issues

## Publishing to Google Play Store

1. Build a signed release APK or App Bundle (`.aab`):
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. The bundle will be at: `android/app/build/outputs/bundle/release/app-release.aab`

3. Create a Google Play Console account at https://play.google.com/console

4. Follow the Google Play publishing guidelines to upload your app

## API and Backend Considerations

**Important:** This mobile app is a WebView wrapper. It requires:

1. **Internet connection** - The app needs network access to function
2. **Backend API** - Configure your backend URL in the app if different from web version
3. **CORS** - Ensure your backend allows requests from `capacitor://` and `https://` schemes

For a fully offline app, you would need to:
- Implement local storage for data
- Add service workers for offline functionality
- Cache API responses

## Support and Resources

- **Capacitor Documentation:** https://capacitorjs.com/docs
- **Android Developer Guides:** https://developer.android.com/guide
- **Capacitor Android Platform:** https://capacitorjs.com/docs/android

## Current Configuration

- **App ID:** com.mate.music
- **App Name:** Mate Music
- **Package Name:** com.mate.music
- **Min SDK:** 22 (Android 5.1)
- **Target SDK:** 33 (Android 13)
- **Capacitor Version:** 7.4.3
- **Android Scheme:** https
- **Splash Screen:** Dark theme (#1a1625)
- **Status Bar:** Dark style with dark background
