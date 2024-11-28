import { supabase } from "../lib/supabaseClient";

// Fetch content
export const fetchContent = async () => {
  const { data, error } = await supabase.from("content").select("*").single();
  if (error) {
    console.error("Error fetching content:", error);
    return null; // Return null if no content found
  }
  return data || null;
};

// Update existing content
export const updateContent = async (id, updates) => {
  const { error } = await supabase.from("content").update(updates).eq("id", id);
  debugger;
  if (error) {
    throw new Error("Failed to update content");
  }
};

// Insert new content
export const insertContent = async (newContent) => {
  const { data, error } = await supabase.from("content").insert(newContent).select("*").single();
  debugger;
  if (error) {
    throw new Error("Failed to insert content");
  }
  return data; // Return the newly inserted content
};
