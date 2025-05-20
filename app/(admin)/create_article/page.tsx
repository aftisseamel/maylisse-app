'use client'; // le client side

import { redirect } from 'next/navigation';
import { createArticle } from './action';
import { useTransition } from 'react';
import Input from '@/components/Input';
import NavigationBar from '@/components/NavigationBar';

export default function Create_article() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Nom de l'article" required />
          <Input name="price" type="number" placeholder="Prix (€)" required />
          <Input name="quantity" type="number" placeholder="Quantité" required />
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


