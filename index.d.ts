import { UploadApiResponse } from "cloudinary";
import mongoose from "mongoose"


declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
      resources?: UploadApiResponse[];
    }
  }
}