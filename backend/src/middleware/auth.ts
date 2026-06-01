import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { adminAuth } from '../config/firebase';
import { User } from '../models/User';

export interface AuthRequest extends Request {
    user?: any;
    firebaseUid?: string;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
            return;
        }

        const token = authHeader.split(' ')[1];
        
        // If Firebase Admin is not initialized, fallback to mock for dev
        if (admin.apps.length === 0) {
            console.warn('[AuthMiddleware] Firebase Admin not initialized. Falling back to mock auth.');
            req.firebaseUid = 'dev-mock-uid';
            let user = await User.findOne({ firebaseUid: 'dev-mock-uid' });
            
            if (!user) {
                console.log('[AuthMiddleware] Mock user not found in DB. Auto-creating.');
                user = new User({
                    firebaseUid: 'dev-mock-uid',
                    email: 'mock@codeflow.com',
                    displayName: 'Mock Developer',
                    photoURL: ''
                });
                await user.save();
            }
            
            req.user = user;
            return next();
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.firebaseUid = decodedToken.uid;

        let user = await User.findOne({ firebaseUid: decodedToken.uid });
        
        if (!user) {
            console.log(`[AuthMiddleware] User ${decodedToken.uid} not found in DB. Auto-creating from token.`);
            user = new User({
                firebaseUid: decodedToken.uid,
                email: decodedToken.email || 'developer@codeflow.com',
                displayName: decodedToken.name || 'Developer',
                photoURL: decodedToken.picture || ''
            });
            await user.save();
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('[AuthMiddleware] Verification failed:', error);
        res.status(401).json({ message: 'Unauthorized: Token verification failed' });
    }
};

