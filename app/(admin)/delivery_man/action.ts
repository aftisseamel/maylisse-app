'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteDeliveryMan(id: number) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('delivery_man')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting delivery man:', error)
      return { error: 'Une erreur est survenue lors de la suppression du livreur' }
    }

    revalidatePath('/delivery_man')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'Une erreur inattendue est survenue' }
  }
} 