import { supabase } from "../../../../src/Config/supabaseClient";
export const getActivePriorityRules = async (categoryType) => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("priority_rules")
    .select("*")
    .eq("category_type", categoryType)
    .eq("active", true)
    .lte("start_time", now)
    .gte("end_time", now);

  if (error) {
    console.error("Error fetching priority rules:", error);
    return [];
  }

  return data;
};
