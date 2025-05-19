'use server'

import { createClient } from '@/utils/supabase/server';

export async function data_delivery_men() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('delivery_man')
            .select('*')
            .order('pseudo_delivery_man', { ascending: true });

        if (error) {
            console.error('Error fetching delivery men:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in data_delivery_men:', error);
        return [];
    }
}

export default data_delivery_men;
