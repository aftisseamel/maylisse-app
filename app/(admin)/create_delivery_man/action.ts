'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createDeliveryMan(formData: FormData) {
    const supabase = await createClient()
    
    const data = {
        pseudo_delivery_man: formData.get('pseudo_delivery_man') as string,
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address_delivery_man: formData.get('address_delivery_man') as string,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('delivery_man').insert([data])
    
    if (error) {
        redirect('/error')
    } else {
        revalidatePath('/private')
        redirect('/admin')
    }
}
