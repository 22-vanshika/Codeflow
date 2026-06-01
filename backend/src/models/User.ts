import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog {
    title: string;
    type: string;
    createdAt: Date;
}

export interface IUser extends Document {
    firebaseUid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    githubAccessToken?: string;
    progress: Map<string, boolean>;
    bio?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    streak: number;
    lastActiveDate?: Date;
    activityLogs: IActivityLog[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        firebaseUid: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        displayName: { type: String, required: true },
        photoURL: { type: String },
        githubAccessToken: { type: String },
        progress: { type: Map, of: Boolean, default: {} },
        bio: { type: String, default: '' },
        githubUrl: { type: String, default: '' },
        linkedinUrl: { type: String, default: '' },
        portfolioUrl: { type: String, default: '' },
        streak: { type: Number, default: 0 },
        lastActiveDate: { type: Date },
        activityLogs: [
            {
                title: { type: String, required: true },
                type: { type: String, required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

