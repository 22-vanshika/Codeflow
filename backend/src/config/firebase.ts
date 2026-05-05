import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
// In a real production environment, you'd use a service account key JSON file
// For development, we'll try to initialize with default credentials if available,
// or skip initialization if no project ID is provided to avoid crashing the dev server.
export const initFirebaseAdmin = () => {
    try {
        if (!admin.apps.length) {
            if (process.env.FIREBASE_PROJECT_ID) {
                admin.initializeApp({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    // credential: admin.credential.cert(...)
                });
                console.log('Firebase Admin initialized');
            } else {
                console.warn('Firebase Admin skipped: FIREBASE_PROJECT_ID not set');
            }
        }
    } catch (error) {
        console.error('Firebase Admin init error:', error);
    }
};

export const adminAuth = admin.auth;
