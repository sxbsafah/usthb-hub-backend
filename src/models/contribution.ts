import mongoose from "mongoose";

export interface IContribution {
  userId: mongoose.Types.ObjectId;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const contributionSchema = new mongoose.Schema<IContribution>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User ID is required"],
    ref: "User",
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: [true, "Description is required"],
    maxLength: [500, "Description must be at most 500 characters long"],
    minLength: [10, "Description must be at least 10 characters long"],
  }
}, { timestamps: true });


export default mongoose.model<IContribution>("Contribution", contributionSchema);

