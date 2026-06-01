import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    userId: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
