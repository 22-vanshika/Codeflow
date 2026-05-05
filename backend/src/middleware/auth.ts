import { Request, Response, NextFunction } from 'express';
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
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const token = authHeader.split('Bearer ')[1];
        
        // If we don't have Firebase Admin configured correctly (e.g. in dev), 
        // we might mock this or return an error
        if (!adminAuth) {
            console.warn('Firebase Admin not initialized, mocking auth for dev...');
            req.firebaseUid = 'dev-mock-uid';
            const user = await User.findOne({ firebaseUid: 'dev-mock-uid' });
            req.user = user;
            return next();
        }

        const decodedToken = await adminAuth().verifyIdToken(token);
        req.firebaseUid = decodedToken.uid;

        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        req.user = user;

        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
