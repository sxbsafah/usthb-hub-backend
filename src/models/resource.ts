import mongoose from "mongoose";


export interface IResource {
  contributionId: mongoose.Types.ObjectId;
  file_url: string;
  publicId: string;
  status: "approved" | "pending" | "rejected";
  subModuleId: mongoose.Types.ObjectId;
  resourceType: "td" | "tp" | "exam" | "course_material";
}


const resourceSchema = new mongoose.Schema<IResource>({
  contributionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Contribution ID is required"],
    ref: "Contribution",
  },
  file_url: {
    type: mongoose.Schema.Types.String,
    required: [true, "File URL is required"],
    unique: true,
  },
  publicId: {
    type: mongoose.Schema.Types.String,
    required: [true, "Public ID is required"],
    unique: true,
  },
  status: {
    type: mongoose.Schema.Types.String,
    enum: {
      values: ["approved", "pending", "rejected"],
      message: "Status must be either 'approved', 'pending', or 'rejected'",
    },
    default: "pending",
    required: [true, "Status is required"],
  },
  subModuleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "SubModule ID is required"],
    ref: "SubModule",
  },
  resourceType: {
    type: mongoose.Schema.Types.String,
    enum: {
      values: ["td", "tp", "exam", "course_material"],
      message: "Resource type must be either 'td', 'tp', 'exam', or 'course_material'",
    },
    required: [true, "Resource type is required"],
  },
})


export default mongoose.model<IResource>("Resource", resourceSchema);