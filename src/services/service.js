import { supabaseClient } from "./supabase";

export const fetchMajors = async () => {
    const { data, error } = await supabaseClient.from("majors").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

export const fetchRequirements = async (major_id) => {
  const { data, error } = await supabaseClient
    .from('direct_requirements')
    .select(`
      *,
      courses:course_code!inner (
        *
      )
    `)
    .eq('major_id', major_id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}