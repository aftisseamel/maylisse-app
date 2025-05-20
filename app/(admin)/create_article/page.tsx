'use client'; // le client side

import { redirect } from 'next/navigation';
import { createArticle } from './action';
import { useTransition, useState } from 'react';
import Input from '@/components/Input';
import NavigationBar from '@/components/NavigationBar';

export default function Create_article() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const price = parseFloat(formData.get('price') as string);
    const quantity = parseInt(formData.get('quantity') as string, 10);

    if (price < 0) {
      setError('Le prix ne peut pas être négatif');
      return;
    }

    if (quantity < 0) {
      setError('La quantité ne peut pas être négative');
      return;
    }

    startTransition(async () => {
      await createArticle(formData);
      redirect('/admin');
    });
  };

  return (
    <div>
      <NavigationBar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6"> Créer un article </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Nom de l'article" required />
          <Input 
            name="price" 
            type="number" 
            placeholder="Prix (€)" 
            required 
            min="0"
            step="0.01"
          />
          <Input 
            name="quantity" 
            type="number" 
            placeholder="Quantité" 
            required 
            min="0"
            step="1"
          />
          <Input name="description" placeholder="Description" required />

          <button
            type="submit"
            className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
              isPending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isPending ? 'Création...' : 'Créer'}
          </button>
        </form>
      </div>
    </div>
  );
}


