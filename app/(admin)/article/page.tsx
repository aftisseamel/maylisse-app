'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import SearchBar from "../../components/SearchBarArticles";
import data_articles from "../../datas/data_articles";
import { createClient } from '@/utils/supabase/client';
import NavigationBar from '@/app/components/NavigationBar';

export default function Page() {

  const [articles, setArticles] = useState<Tables<"article">[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Tables<"article">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantityChanges, setQuantityChanges] = useState<{ [key: number]: number }>({});
  const [editingArticle, setEditingArticle] = useState<{ id: number; price: number } | null>(null);
  const [priceChanges, setPriceChanges] = useState<{ [key: number]: number }>({});

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

  const handleSearchResults = (results: Tables<"article">[]) => {
    setFilteredArticles(results);
  };

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

  const resetQuantity = async (articleId: number) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('article')
        .update({ quantity: 0 })
        .eq('id', articleId);

      if (error) throw error;

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

  const handleQuantityChange = (articleId: number, value: string) => {
    const cleanValue = value.replace(/^0+/, '');
    const numValue = parseInt(cleanValue) || 0;
    setQuantityChanges(prev => ({
      ...prev,
      [articleId]: numValue
    }));
  };

  const handlePriceChange = (articleId: number, value: string) => {
    const cleanValue = value.replace(/^0+(\d)/, '$1');
    const numValue = parseFloat(cleanValue) || 0;
    setPriceChanges(prev => ({
      ...prev,
      [articleId]: numValue
    }));
  };

  const updatePrice = async (articleId: number) => {
    const newPrice = priceChanges[articleId];
    if (newPrice === undefined || newPrice < 0) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('article')
        .update({ price: newPrice })
        .eq('id', articleId);

      if (error) throw error;

      setArticles(articles.map(article => 
        article.id === articleId ? { ...article, price: newPrice } : article
      ));
      setFilteredArticles(filteredArticles.map(article => 
        article.id === articleId ? { ...article, price: newPrice } : article
      ));
      setPriceChanges(prev => ({
        ...prev,
        [articleId]: 0
      }));
    } catch (err) {
      console.error('Error updating price:', err);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">Articles</h1>
            <div className="flex items-center gap-4">
              <div className="w-full md:w-80">
                <SearchBar articles={articles} onSearchResults={handleSearchResults} />
              </div>
              <Link
                href="/create_article"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <span className="text-xl">+</span>
                <span>Créer un article</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold pb-2 border-b border-gray-200">{article.name}</h3>
                <div className="space-y-2 mt-2">
                  {article.description && (
                    <p className="text-sm text-gray-600">{article.description}</p>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Prix actuel</span>
                      <span className="text-lg font-semibold text-gray-900">{article.price}€</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={priceChanges[article.id] || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.startsWith('0') && value.length > 1) {
                            e.target.value = value.slice(1);
                          }
                          handlePriceChange(article.id, e.target.value);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Nouveau prix"
                      />
                      <button
                        onClick={() => updatePrice(article.id)}
                        className="bg-blue-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        Mettre à jour
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Stock actuel</span>
                      <span className="text-lg font-semibold text-gray-900">{article.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(article.id, -(quantityChanges[article.id] || 0))}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                      >
                        Retirer
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={quantityChanges[article.id] || 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.startsWith('0') && value.length > 1) {
                            e.target.value = value.slice(1);
                          }
                          handleQuantityChange(article.id, e.target.value);
                        }}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Qté"
                      />
                      <button
                        onClick={() => updateQuantity(article.id, quantityChanges[article.id] || 0)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                    <button
                      onClick={() => resetQuantity(article.id)}
                      className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      Réinitialiser le stock
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <p className="text-center py-4">Aucun article trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
}
