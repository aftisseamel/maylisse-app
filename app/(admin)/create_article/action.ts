'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createArticle(formData: FormData) {
    const price = parseFloat(formData.get('price') as string) || 0;
    const quantity = parseInt(formData.get('quantity') as string, 10) || 0;
    
    const supabase = await createClient()
    
    const data = {
        name: formData.get('name') as string, 
        price: price,
        quantity: quantity,
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
        redirect('/article')
    }
}
