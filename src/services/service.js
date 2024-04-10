import { supabaseClient } from "./supabase";

export const fetchMajors = async () => {
    const { data, error } = await supabaseClient.from("majors").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
