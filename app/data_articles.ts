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
        console.log(data)
    }
    //const mapData = data.map((item: { name : string, quantity: number | null, description: string | null}) => [item.name, item.quantity]);

    //console.log("le type de map data c'est ", (mapData))

    return data
}
export default data_articles;
