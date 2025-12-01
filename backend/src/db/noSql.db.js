import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/LMS`);
  } catch (error) {
    console.log(error);
  }
};

export { connectDB };
