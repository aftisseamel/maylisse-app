'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import SearchBar from "../../components/SearchBarArticles";
import data_articles from "../../data_articles";

export default function Page() {
  const [articles, setArticles] = useState<Tables<"article">[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Tables<"article">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const data = await data_articles();
        setArticles(data);
        setFilteredArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleSearchResults = (results: Tables<"article">[]) => {
    setFilteredArticles(results);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et barre de recherche */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 md:mb-0">
            Articles
          </h1>
          <div className="w-full md:w-96">
            <SearchBar articles={articles} onSearchResults={handleSearchResults} />
          </div>
        </div>

        {/* Grille d'articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {article.image_url && (
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{article.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-indigo-600">{article.price}€</p>
                  <p>Quantité: {article.quantity}</p>
                  {article.description && (
                    <p className="line-clamp-2">{article.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun article trouvé */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun article trouvé
            </p>
          </div>
        )}

        {/* Bouton de création */}
        <div className="flex justify-center mt-10">
          <Link
            href="/create_article"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold py-4 px-8 rounded-full shadow-md transition-all duration-300"
          >
            Créer un article
          </Link>
        </div>
      </div>
    </div>
  );
}
