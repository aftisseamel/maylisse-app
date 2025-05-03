'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createArticle(formData: FormData) {
    
    const supabase = await createClient()
    
    const data = {
        name : formData.get('name') as string, // <-- Ici on enregistre bien le "name" attendu par Supabase
        image_url: formData.get('image_url') as string,
        price: parseFloat(formData.get('price') as string) || 0,
        quantity: parseInt(formData.get('quantity') as string, 10) || 0,
        description: formData.get('description') as string,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    console.log("data", data)

    const { error } = await supabase.from('article').insert([data])
    console.log('error', error)
    if (error) {
        redirect('/error')
    } else {
        revalidatePath('/private')
        redirect('/valid')
    }
}
