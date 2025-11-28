import mongoose, { type ConnectOptions } from "mongoose";
import config from "@/config/index";

const clientOptions: ConnectOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export const connectToDatabase = async () => {
  if (!config.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    console.log("Connected to MongoDB successfully");
  } catch {
    console.log("Failed to connect to MongoDB");
    throw new Error("Failed to connect to MongoDB");
  }
}


export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB successfully");  
  } catch (err) {
    throw new Error("Failed to disconnect from MongoDB");
  }
}