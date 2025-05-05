'use client'
import { useTransition } from "react";
import { redirect } from "next/navigation";
import { createOrder } from "./action";
import Link from "next/link";

export default function Create_order() {

    const [isPending, startTransition] = useTransition();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
            await createOrder(formData);
            redirect('/order');
        });
    };
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6"> Créer une commande </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
       
            <Input name="delivery_address" placeholder="adresse de livraison" required />
            <Input name="pseudo" placeholder="pseudo du livreur" required />
            <Input name="name_client" placeholder="nom du client" required />
            <Input name="description commande" placeholder="description de la commande" required />
            <select
                name="status" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
                defaultValue=""
            >   
                <option value="" disabled>Choisir status</option>
                <option value="initiated">initiated</option>
                <option value="preparation">preparation</option>
                <option value="prepared">prepared</option>
                <option value="delivering">delivering</option>
                <option value="delivered">delivering</option>
                <option value="finished">finished</option>
                <option value="canceled">delivering</option>
              </select>

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

        <Link href="/ajuster_la_commande" className="text-indigo-600 hover:underline mt-4 block text-center">
          ajouter les articles et prix à la commande        
        </Link>
        
        </div>
    )
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
  