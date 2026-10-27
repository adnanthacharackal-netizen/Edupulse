# EduPulse

EduPulse is a React + Vite student dashboard configured for Android packaging with Capacitor.

## Android APK setup

### 1. Install dependencies
```bash
npm install
```

### 2. Build the web app
```bash
npm run build
```

### 3. Create the Android project (first time only)
```bash
npx cap add android
```

### 4. Sync the web build
```bash
npx cap sync android
```

### 5. Open in Android Studio
```bash
npx cap open android
```

Then use **Build > Generate Signed App Bundle / APK** in Android Studio to create the APK.

### App identity
- App name: **EduPulse**
- Android application ID: **com.edupulse.studenthub**
- Web output: **dist**
- Orientation: **Portrait**

## Useful commands

```bash
npm run android:open
npm run android:run
npm run cap:sync
```

> The `android/` folder is intentionally not committed to this source package. Run `npx cap add android` once on a machine with the Android SDK installed.
