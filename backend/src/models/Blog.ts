import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    author: string;
    authorInitials: string;
    gradient: string;
    category?: string; // e.g., 'Interview Experience' or 'Tutorial'
    company?: string; // for interview experiences
    sourceUrl?: string; // for citation/attributions
    bookmarks: string[]; // array of firebaseUids
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        slug: { type: String, required: true, unique: true, index: true },
        title: { type: String, required: true },
        excerpt: { type: String, required: true },
        content: { type: String, required: true },
        date: { type: String, required: true },
        readTime: { type: String, required: true },
        author: { type: String, required: true },
        authorInitials: { type: String, required: true },
        gradient: { type: String, required: true },
        category: { type: String, default: 'Tutorial' },
        company: { type: String },
        sourceUrl: { type: String },
        bookmarks: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);
