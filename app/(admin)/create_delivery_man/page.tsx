'use client';

import { useTransition, useState } from 'react';
import { createDeliveryMan } from './action';
import Input from '@/components/Input';
import { IoAlertCircle } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';

export default function CreateDeliveryMan() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await createDeliveryMan(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      router.push('/delivery_man');
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Créer un livreur</h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <IoAlertCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form action={(formData) => startTransition(() => handleSubmit(formData))}>
              <div className="space-y-4">
                <Input 
                  name="pseudo_delivery_man" 
                  label="Pseudo"
                  placeholder="Pseudo du livreur" 
                  required 
                />
                <Input 
                  name="first_name" 
                  label="Prénom"
                  placeholder="Prénom" 
                  required 
                />
                <Input 
                  name="last_name" 
                  label="Nom"
                  placeholder="Nom" 
                  required 
                />
                <Input 
                  name="email" 
                  label="Email"
                  type="email" 
                  placeholder="Email" 
                  required 
                />
                <Input 
                  name="phone" 
                  label="Téléphone"
                  placeholder="Téléphone" 
                />
                <Input 
                  name="address_delivery_man" 
                  label="Adresse"
                  placeholder="Adresse" 
                />
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="status"
                    name="status"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="status" className="text-sm text-gray-600">
                    Disponible immédiatement
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Création en cours...' : 'Créer le livreur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}