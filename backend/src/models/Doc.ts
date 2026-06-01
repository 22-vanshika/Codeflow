import mongoose, { Document, Schema } from 'mongoose';

export interface IDoc extends Document {
    slug: string;
    title: string;
    content: string;
    category: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
}

const DocSchema = new Schema<IDoc>(
    {
        slug: { type: String, required: true, unique: true, index: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: { type: String, required: true },
        version: { type: String, required: true, default: 'v1.2.0' },
    },
    { timestamps: true }
);

export const Doc = mongoose.model<IDoc>('Doc', DocSchema);
