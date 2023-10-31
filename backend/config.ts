import { config } from 'dotenv';
config();

export const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/reviews';
