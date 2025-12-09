import mongoose from "mongoose";


export interface IFaculty {
  name: string;
}


const facultySchema = new mongoose.Schema<IFaculty>({
  name: {
    type: mongoose.Schema.Types.String,
    required: [true, "Faculty name is required"],
    unique: true,
    maxLength: [100, "Faculty name must be at most 100 characters long"],
    minLength: [2, "Faculty name must be at least 2 characters long"],
  },
})


export default mongoose.model<IFaculty>("Faculty", facultySchema);

