"use server"
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database.types";

const data_articles = async () : Promise<Tables<"article"> []>  => {
    const supabase = await createClient();

    const { data, error } = await supabase.from('article').select();

    if (error) {
        console.error("Error fetching articles:", error);
        return [];
    } else {
        //console.log(data)
    }
  
    return data
}
export default data_articles;
