"use server"

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database.types";
import { redirect } from "next/navigation";

export async function data_orders() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('order')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in data_orders:', error);
        return [];
    }
}

export default data_orders;