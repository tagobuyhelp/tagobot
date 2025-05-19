import mongoose from 'mongoose';

const DB_NAME = 'TagoBot';


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

        console.log("MongoDB connection Successfully...");
    } catch (err) {
        console.error("MondoDb connection Failed", err)
        process.exit(1)
    }
}




export default connectDB

