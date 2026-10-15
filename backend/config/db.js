import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully !!`);
  } catch (error) {
    console.log("Error While connecting to MongoDB :", error);
    process.exit(1); // Stop the application if MongoDB connection fails
  }
};

export default connectDb;
