'use client';

import { redirect } from 'next/navigation';
import { createDeliveryMan } from './action';
import { useTransition } from 'react';

export default function Create_delivery_man() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await createDeliveryMan(formData);
      redirect('/admin');
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Créer un livreur</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="pseudo_delivery_man" placeholder="Pseudo du livreur" required />
        <Input name="first_name" placeholder="Prénom" required />
        <Input name="last_name" placeholder="Nom" required />
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="phone" placeholder="Téléphone" />
        <Input name="address_delivery_man" placeholder="Adresse" />

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
            isPending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPending ? 'Création...' : 'Créer'}
        </button>
      </form>
    </div>
  );
}

function Input({ name, type = 'text', placeholder, required = false }: { name: string; type?: string; placeholder: string; required?: boolean }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
    />
  );
}