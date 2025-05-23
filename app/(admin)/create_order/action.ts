'use server'
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Tables } from "@/database.types";

type OrderStatus = Tables<"order">["status"]

export async function createOrder(formData: FormData) {
    try {
        const supabase = await createClient()
        
        const data = {
            delivery_address: formData.get('delivery_address') as string,
            pseudo_delivery_man: formData.get('pseudo_delivery_man') as string,
            name_client: formData.get('name_client') as string,
            description_order: formData.get('description_order') as string,
            status: formData.get('status') as OrderStatus,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        console.log("data", data)

        const { error } = await supabase.from('order').insert([data])
        console.log('error', error)
        
        if (error) {
            return { error: error.message }
        }

        revalidatePath('/order')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Error creating order:', error)
        return { error: 'Une erreur est survenue lors de la création de la commande' }
    }
}