'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createSupabaseClient } from '@/utils/supabase/server'

export async function createClient(formData: FormData) {
    
    const supabase = await createSupabaseClient()
    
    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address_client: formData.get('address_client') as string,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    console.log("data", data)

    const { error } = await supabase.from('client').insert([data])
    console.log('error', error)
    if (error) {
        redirect('/error')
    } else {
        revalidatePath('/private')
        redirect('/client')
    }
}
