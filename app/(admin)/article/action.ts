'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteArticle(id: number) {
  const supabase = await createClient()
  
  try {
    // D'abord supprimer les références dans order_article
    const { error: orderArticlesError } = await supabase
      .from('order_article')
      .delete()
      .eq('id_article', id)

    if (orderArticlesError) {
      console.error('Error deleting article references:', orderArticlesError)
      return { error: 'Une erreur est survenue lors de la suppression des références de l\'article' }
    }

    // Ensuite supprimer l'article
    const { error: articleError } = await supabase
      .from('article')
      .delete()
      .eq('id', id)

    if (articleError) {
      console.error('Error deleting article:', articleError)
      return { error: 'Une erreur est survenue lors de la suppression de l\'article' }
    }

    revalidatePath('/article')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'Une erreur inattendue est survenue' }
  }
} 