"use server"

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database.types";
import { redirect } from "next/navigation";


const data_clients = async () : Promise<Tables<"client"> []>  => {
    const supabase = await createClient();

    const { data, error } = await supabase.from('client').select();

    if (error) {
        console.error("Error fetching orders:", error);
        return [];
    } else {
        console.log(data)
    }
   

    return data
}

export default data_clients;