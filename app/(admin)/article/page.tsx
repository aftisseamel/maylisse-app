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
  const [editArticleId, setEditArticleId] = useState<number | null>(null);
  const [editedArticleData, setEditedArticleData] = useState<{
    name?: string;
    description?: string;
  }>({});

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

  const handleEditArticle = (article: Tables<"article">) => {
    setEditArticleId(article.id);
    setEditedArticleData({
      name: article.name,
      description: article.description || ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedArticleData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveArticle = async (articleId: number) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('article')
        .update(editedArticleData)
        .eq('id', articleId);

      if (error) throw error;

      // Mettre à jour la liste locale
      const updatedArticles = articles.map(article =>
        article.id === articleId ? { ...article, ...editedArticleData } : article
      );
      setArticles(updatedArticles);
      setFilteredArticles(updatedArticles);
      setEditArticleId(null);
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Une erreur est survenue lors de la mise à jour de l\'article');
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Articles</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                {editArticleId === article.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editedArticleData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nom de l'article"
                    />
                    <textarea
                      value={editedArticleData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                      placeholder="Description"
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleSaveArticle(article.id)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setEditArticleId(null)}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-800">{article.name}</h3>
                      <button
                        onClick={() => handleEditArticle(article)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Modifier"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    
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
                  </>
                )}
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun article trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
