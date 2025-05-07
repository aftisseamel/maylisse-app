'use server'

import { Tables } from '@/database.types';
import { createClient } from '@/utils/supabase/server';

const data_delivery_men = async () : Promise<Tables<"delivery_man">[]> => {

    
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('delivery_man')
            .select('*')
            .order('pseudo_delivery_man', { ascending: true });

        if (error) {
            console.error('Error:', error);
            return [];
        }

        return data

    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export default data_delivery_men;