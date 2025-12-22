import Faculty from "@/models/faculty";
import mongoose from "mongoose";

export async function getFacultyNameById(
  facultyId: mongoose.Types.ObjectId | string
) {
  if (!facultyId) return null;
  const faculty = await Faculty.findById(facultyId).select("name");
  return faculty ? faculty.name : null;
}
