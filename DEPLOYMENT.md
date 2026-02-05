# Deployment Guide

This guide details how to deploy the PackageMatch application components to production-ready services.

## Prerequisites
- GitHub Account (with the project pushed)
- [Render.com](https://render.com) Account (for Backend & DB)
- [Vercel.com](https://vercel.com) Account (for Frontend)
- [Expo.dev](https://expo.dev) Account (Optional, for mobile builds)

---

## 1. Backend Deployment (Render)

1.  **Create a PostgreSQL Database**:
    -   Go to Render Dashboard > New > PostgreSQL.
    -   Name: `packagematch-db`.
    -   Copy the `Internal DB URL`.

2.  **Deploy the Web Service**:
    -   Go to Render > New > Web Service.
    -   Connect your GitHub Repo.
    -   **Root Directory**: `backend`.
    -   **Runtime**: Node.js.
    -   **Build Command**: `npm install && npm run build`.
    -   **Start Command**: `npm start`.
    -   **Environment Variables**:
        -   `NODE_ENV`: `production`
        -   `DATABASE_URL`: (Paste Internal DB URL from step 1)
        -   `JWT_SECRET`: (Generate a strong random string)
        -   `STRIPE_SECRET_KEY`: (Your Stripe Secret Key)
        -   `REDIS_URL`: (Optional, or setup a Redis instance on Render)

3.  **Copy Backend URL**:
    -   Once deployed, copy the service URL (e.g., `https://package-match-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

1.  **Import Project**:
    -   Go to Vercel Dashboard > Add New > Project.
    -   Import your GitHub Repo.

2.  **Configure Build**:
    -   **Framework Preset**: Vite.
    -   **Root Directory**: `frontend-web`.
    -   **Environment Variables**:
        -   `VITE_API_URL`: (Paste your Render Backend URL + `/api`)
            -   Example: `https://package-match-backend.onrender.com/api`
        -   `VITE_FIREBASE_API_KEY`: (Your Firebase Config)

3.  **Deploy**:
    -   Click **Deploy**. Vercel will build and host your site.

---

## 3. Mobile App Deployment (Expo)

1.  **Update Configuration**:
    -   Open `mobile/services/config.ts`.
    -   Update the production URL in the `!__DEV__` check to your Render Backend URL.

2.  **Build with EAS (Expo Application Services)**:
    -   Install EAS CLI: `npm install -g eas-cli`
    -   Login: `eas login`
    -   Configure: `eas build:configure`
    -   Build for Android: `eas build -p android --profile preview`
    -   Build for iOS: `eas build -p ios --profile preview`

3.  **OTA Updates**:
    -   You can publish updates instantly using `npx expo export && npx expo publish`.
