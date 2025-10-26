# FuelCal

A free and open-source IOS/Android/Web app for calculating & splitting Fuel costs when carpooling.

## What it does

You drove 112km with 3 friends. Your car gets a mileage of 7.5L/km. Gas costs 2.66AED. How much does each person owe?

FuelCal does the math for you.

## Features

- Calculate total fuel cost based on distance and consumption
- Split costs between multiple people
- Switch between AED and INR currencies
- Toggle between L/100km and km/L fuel units
- Saves your last inputs (except trip distance)
- Works on iOS, Android, and web

## Getting started

```bash
npm install
npm start
```

Then scan the QR code with Expo Go (Android) or Camera app (iOS).

## Development

For local development with Expo:

```bash
npm run android  # Run on Android emulator
npm run ios      # Run on iOS simulator
npm run web      # Run in browser
```

## Deployment

This app uses Expo's build service for deployment.

### Building for app stores

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure the project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Publishing updates

After making changes, you can push OTA updates without rebuilding:

```bash
eas update --branch production
```

### Web deployment

The web version can be deployed to any static hosting service:

```bash
npm run web
# Then deploy the web-build folder to Vercel, Netlify, etc.
```

## Tech stack

Built with React Native and Expo Router. Uses AsyncStorage to remember your settings.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Author

[@raj_msn](https://github.com/raj-msn)

Found a bug? Open an issue or send a PR.
