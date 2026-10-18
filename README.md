# Vehicle Fuel Tracker

A minimal, premium-designed web application to track vehicle fuel expenses and mileage. Built with React, Tailwind CSS, and Firebase.

## Features
- **Multi-Vehicle Support**: Track Activa 5G, Yamaha FZ Hybrid, and Maruti Suzuki Dzire.
- **Mileage Calculation**: Automatically calculates fuel efficiency (km/l) based on odometer readings.
- **Cost Tracking**: Monitor total spend per vehicle.
- **Cloud Sync**: Syncs data across devices using Firebase (Optional).
- **Offline Capable**: Works with LocalStorage if Firebase is not configured.
- **Premium UI**: Dark mode, glassmorphism, and smooth animations.

## Getting Started

### Prerequisites
- Node.js installed.

### Installation
1.  Clone or navigate to the project directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Firebase Setup (Optional for Cloud Sync)
To enable cloud synchronization (free):
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Enable **Firestore Database** in test mode or with appropriate rules.
4.  Copy your **Web App Configuration** (apiKey, projectId, etc.).
5.  Open `src/firebase.js` and replace the placeholder values with your config.

## Technologies Used
- React + Vite
- Tailwind CSS
- Firebase Firestore source
