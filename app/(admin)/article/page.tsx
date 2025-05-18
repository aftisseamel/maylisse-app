'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import SearchBar from "../../components/SearchBarArticles";
import data_articles from "../../data_articles";
import { createClient } from '@/utils/supabase/client';
import NavigationBar from '@/app/components/NavigationBar';

export default function Page() {

  const [articles, setArticles] = useState<Tables<"article">[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Tables<"article">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantityChanges, setQuantityChanges] = useState<{ [key: number]: number }>({});

  // Charger les articles au démarrage
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await data_articles();
        setArticles(data);
        setFilteredArticles(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Mettre à jour les articles filtrés quand on les recherche
  const handleSearchResults = (results: Tables<"article">[]) => {
    setFilteredArticles(results);
  };

  // Modifier la quantité d'un article
  const updateQuantity = async (articleId: number, change: number) => {
    const currentQuantity = articles.find(a => a.id === articleId)?.quantity || 0;
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 0) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('article')
        .update({ quantity: newQuantity })
        .eq('id', articleId);

      if (error) throw error;

      // Mettre à jour l'état local
      setArticles(articles.map(article => 
        article.id === articleId ? { ...article, quantity: newQuantity } : article
      ));
      setFilteredArticles(filteredArticles.map(article => 
        article.id === articleId ? { ...article, quantity: newQuantity } : article
      ));
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  // Réinitialiser la quantité d'un article à 0
  const resetQuantity = async (articleId: number) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('article')
        .update({ quantity: 0 })
        .eq('id', articleId);

      if (error) throw error;

      // Mettre à jour l'état local
      setArticles(articles.map(article => 
        article.id === articleId ? { ...article, quantity: 0 } : article
      ));
      setFilteredArticles(filteredArticles.map(article => 
        article.id === articleId ? { ...article, quantity: 0 } : article
      ));
    } catch (err) {
      console.error('Error resetting quantity:', err);
    }
  };

  // Gérer le changement de valeur dans l'input
  const handleQuantityChange = (articleId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setQuantityChanges(prev => ({
      ...prev,
      [articleId]: numValue
    }));
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <NavigationBar />
      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* En-tête avec titre et recherche */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">Articles</h1>
            <div className="w-full md:w-80">
              <SearchBar articles={articles} onSearchResults={handleSearchResults} />
            </div>
          </div>

          {/* Liste des articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold">{article.name}</h3>
                <p className="text-indigo-600">{article.price}€</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(article.id, -(quantityChanges[article.id] || 0))}
                    className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={quantityChanges[article.id] || 0}
                    onChange={(e) => handleQuantityChange(article.id, e.target.value)}
                    className="w-16 px-2 py-1 border rounded text-center"
                  />
                  <button
                    onClick={() => updateQuantity(article.id, quantityChanges[article.id] || 0)}
                    className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                  >
                    +
                  </button>
                  <span className="ml-2">Stock: {article.quantity}</span>
                  <button
                    onClick={() => resetQuantity(article.id)}
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Reset
                  </button>
                </div>
                {article.description && <p className="text-sm text-gray-600 mt-2">{article.description}</p>}
              </div>
            ))}
          </div>

          {/* Message si aucun article */}
          {filteredArticles.length === 0 && (
            <p className="text-center py-4">Aucun article trouvé</p>
          )}

          {/* Bouton de création */}
          <div className="text-center mt-6">
            <Link
              href="/create_article"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Créer un article
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
