import mongoose, { Document, Schema } from 'mongoose';

export interface IVisualization extends Document {
    userId: string;
    title: string;
    description?: string;
    code: string;
    language: string;
    traceSteps: any[]; // JSON array of execution trace steps
    isPublic: boolean;
    settings?: {
        speed?: number;
        input?: string;
    };
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}

const VisualizationSchema = new Schema<IVisualization>(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        description: { type: String },
        code: { type: String, required: true },
        language: { type: String, required: true, default: 'cpp' },
        traceSteps: { type: Schema.Types.Mixed, required: true },
        isPublic: { type: Boolean, default: false },
        settings: { type: Schema.Types.Mixed },
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

export const Visualization = mongoose.model<IVisualization>('Visualization', VisualizationSchema);
