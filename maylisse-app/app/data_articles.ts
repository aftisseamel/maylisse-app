import { createClient } from "@/utils/supabase/server";

const data_articles = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase.from('article').select('name, quantity, description');

    if (error) {
        console.error("Error fetching articles:", error);
        return [];
    } else {
        console.log(data)
    }
    const mapData = data.map((item: { name : string, quantity: number | null, description: string | null}) => [item.name]);

    console.log("le type de map data c'est ", (mapData))

    return mapData
}
export default data_articles;
