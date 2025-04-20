import { createClient } from "@/utils/supabase/server";

const data_articles = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase.from('article').select('name');

    if (error) {
        console.error("Error fetching articles:", error);
        return [];
    }

    return data.map((item: { name: string }) => item.name);
}
export default data_articles;
