'use server'
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
export async function insertOrderArticle(formData: FormData) {
    try {
        const supabase = await createClient();

    const data = {
        id_order: parseInt(formData.get('id_order') as string),
        id_article : parseInt(formData.get('id_article') as string),
        price: parseFloat(formData.get('price') as string),
        quantity: parseFloat(formData.get('quantity') as string),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
        .from('order_article')
        .insert([data]);

    if (error) {
        console.error('Error inserting order article:', error);
        return { error: error.message };
    }

    revalidatePath('/order');
    revalidatePath('/');
    return { success: true };
    } catch (error) {
        console.error('Error inserting order article:', error);
        return { error: 'Une erreur est survenue lors de l\'insertion de l\'article dans la commande' };
    }
}