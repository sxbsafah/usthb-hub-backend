import dotenv from "dotenv";

dotenv.config();


const config = { 
  PORT: process.env.PORT || 3000,
  WHITELIST_ORIGINS: [] as string[],
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI || "",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
}


export default config;

