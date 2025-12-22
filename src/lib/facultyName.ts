import Faculty from "@/models/faculty";

export async function getFacultyNameById(facultyId) {
  if (!facultyId) return null;
  const faculty = await Faculty.findById(facultyId).select("name");
  return faculty ? faculty.name : null;
}
