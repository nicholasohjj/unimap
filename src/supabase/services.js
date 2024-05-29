import { supabase } from "./supabase";
export const fetchMajors = async () => {
  const { data, error } = await supabase.from("majors").select();
  if (error) {
    throw error;
  }

  // sort alphabetically by major name
  data.sort((a, b) => a.major_name.localeCompare(b.major_name));
  return data;
};

export const fetchCourses = async (majorCode) => {
  const { data, error } = await supabase
    .from("direct_requirements")
    .select("*, courses:moduleCode (semesters)")
    .eq("major_code", majorCode);
  if (error) {
    throw error;
  }
  return data;
}
