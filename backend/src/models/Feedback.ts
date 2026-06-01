import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
    rating: number;
    helpedText: string;
    improveText?: string;
    recommend: boolean;
    topicViewed: string;
    userId: string;
    userName: string;
    approved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
    {
        rating: { type: Number, required: true },
        helpedText: { type: String, required: true },
        improveText: { type: String },
        recommend: { type: Boolean, required: true },
        topicViewed: { type: String, required: true, default: 'Algorithm Visualization' },
        userId: { type: String, required: true },
        userName: { type: String, required: true, default: 'Anonymous User' },
        approved: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
