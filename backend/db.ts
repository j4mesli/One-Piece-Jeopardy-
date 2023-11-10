import mongoose from 'mongoose';

const connectDb = async () => {
    await mongoose.connect(process.env.DSN as string)
        .then(() => console.log('MongoDB connected...'))
        .catch(err => console.log(err));
}

export { connectDb };
