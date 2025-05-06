'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Tables } from '@/database.types'

type DeliveryManStatus = Tables<"delivery_man">["status"]

export async function createDeliveryMan(formData: FormData) {
    const data = {
        pseudo_delivery_man: formData.get('pseudo_delivery_man') as string,
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || null,
        address_delivery_man: formData.get('address_delivery_man') as string || null,
        status: (formData.get('status') ? 'available' : 'unavailable') as DeliveryManStatus
    }

    try {
        const supabase = await createClient()
        const { error } = await supabase.from('delivery_man').insert([data])

        if (error) {
            console.error('Error creating delivery man:', error)
            if (error.code === '23505') {
                if (error.message.includes('pseudo_delivery_man')) {
                    return { error: 'Ce pseudo est déjà utilisé par un autre livreur' }
                }
                if (error.message.includes('email')) {
                    return { error: 'Cette adresse email est déjà utilisée' }
                }
            }
            return { error: 'Erreur lors de la création du livreur' }
        }

        revalidatePath('/delivery_man')
        return { success: true }
    } catch (error) {
        console.error('Error:', error)
        return { error: 'Une erreur est survenue' }
    }
}
