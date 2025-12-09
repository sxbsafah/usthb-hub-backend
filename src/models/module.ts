import mongoose from "mongoose";

export interface IModule {
  name: string;
  facultyId: mongoose.Types.ObjectId;
}

const moduleSchema = new mongoose.Schema<IModule>({
  name: {
    type: mongoose.Schema.Types.String,
    required: [true, "Module name is required"],
    unique: true,
    maxLength: [100, "Module name must be at most 100 characters long"],
    minLength: [2, "Module name must be at least 2 characters long"],
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Faculty ID is required"],
    ref: "Faculty",
  }
})


export default mongoose.model<IModule>("Module", moduleSchema);
