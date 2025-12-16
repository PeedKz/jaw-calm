# Jaw Calm - Relaxation App

## Project info

**URL**: https://lovable.dev/projects/201a04a3-125e-4207-8ddd-24b78dbf5673

## Technologies

- Vite + React + TypeScript
- shadcn-ui + Tailwind CSS
- Capacitor (Android/iOS)

## Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

## Android Build (Capacitor)

```sh
# 1. Build the web app
npm run build

# 2. Add Android platform (first time only)
npx cap add android

# 3. Sync web assets to native project
npx cap sync android

# 4. Open in Android Studio
npx cap open android

# Or run directly on device/emulator
npx cap run android
```

## iOS Build (Capacitor)

```sh
# 1. Build the web app
npm run build

# 2. Add iOS platform (first time only)
npx cap add ios

# 3. Sync web assets to native project
npx cap sync ios

# 4. Open in Xcode
npx cap open ios

# Or run directly on device/simulator
npx cap run ios
```

## Live Reload (Development)

For live reload during development, update `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  // ...
  server: {
    url: 'http://YOUR_LOCAL_IP:5173',
    cleartext: true,
  },
};
```

Then run: `npx cap sync && npx cap run android`

## Capacitor Plugins Used

- `@capacitor/app` - Android back button handling
- `@capacitor/local-notifications` - Reminder notifications

## Deploy

Open [Lovable](https://lovable.dev/projects/201a04a3-125e-4207-8ddd-24b78dbf5673) and click Share → Publish.
