'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteOrder(id: number) {
  const supabase = await createClient()
  
  try {
    const { error: orderArticlesError } = await supabase
      .from('order_article')
      .delete()
      .eq('id_order', id)

    if (orderArticlesError) {
      console.error('Error deleting order articles:', orderArticlesError)
      return { error: 'Une erreur est survenue lors de la suppression des articles de la commande' }
    }

    const { error: orderError } = await supabase
      .from('order')
      .delete()
      .eq('id', id)

    if (orderError) {
      console.error('Error deleting order:', orderError)
      return { error: 'Une erreur est survenue lors de la suppression de la commande' }
    }

    revalidatePath('/order')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'Une erreur inattendue est survenue' }
  }
} 