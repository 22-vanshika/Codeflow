import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    firebaseUid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    githubAccessToken?: string;
    progress: Map<string, boolean>;
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
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
