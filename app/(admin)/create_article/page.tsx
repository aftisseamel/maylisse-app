'use client'; // 👈 Obligatoire pour utiliser onSubmit et autres interactions

import { redirect } from 'next/navigation';
import { createArticle } from './action';

export default function Page() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createArticle(formData);
        redirect('/admins');
    };

    return (
        <div>
            <h1>Créer un article</h1>
            <form onSubmit={handleSubmit}>
                
                <input type="number" name="name" placeholder="name de l'article" required />
                <input type="number" name="price" placeholder="Prix de l'article" required />
                <input type="number" name="quantity" placeholder="Quantité de l'article" required />
                <input type="text" name="description" placeholder="Description de l'article" required />
                <input type="text" name="image_url" placeholder="Image de l'article" />
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                >
                    Créer
                </button>
            </form>
        </div>
    );
}
