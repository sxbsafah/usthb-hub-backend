import mongoose from "mongoose";

export interface ISubModule {
  name: string;
  moduleId: mongoose.Types.ObjectId;
}


const subModuleSchema = new mongoose.Schema<ISubModule>({
  name: {
    type: mongoose.Schema.Types.String,
    required: [true, "SubModule name is required"],
    unique: true,
    maxLength: [100, "SubModule name must be at most 100 characters long"],
    minLength: [2, "SubModule name must be at least 2 characters long"],
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Module ID is required"],
    ref: "Module",
  }
})

export default mongoose.model<ISubModule>("SubModule", subModuleSchema);


