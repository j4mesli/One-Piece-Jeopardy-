import mongoose from 'mongoose';

const connectDb = async () => {
    await mongoose.connect(process.env.DSN as string || "mongodb+srv://dbUser:hZQ4Mipd6K2sOe39@cluster0.pmjc24j.mongodb.net/?retryWrites=true&w=majority")
        .then(() => console.log('MongoDB connected...'))
        .catch(err => console.log(err));
}

export { connectDb };
