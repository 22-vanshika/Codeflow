import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedData } from '../services/seeder';

dotenv.config();

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeflow';
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
        
        // Seed initial CMS data
        await seedData();
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Do not exit process in dev, just log error
        // process.exit(1); 
    }
};

