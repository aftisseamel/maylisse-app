'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AdminPage() {
  const [stats, setStats] = useState({
    articles: 0,
    clients: 0,
    orders: 0,
    livreurs: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient();
        
        // Récupérer les statistiques
        const [articles, clients, orders, livreurs] = await Promise.all([
          supabase.from('article').select('id', { count: 'exact' }),
          supabase.from('client').select('id', { count: 'exact' }),
          supabase.from('order').select('id', { count: 'exact' }),
          supabase.from('delivery_man').select('id', { count: 'exact' })
        ]);

        setStats({
          articles: articles.count || 0,
          clients: clients.count || 0,
          orders: orders.count || 0,
          livreurs: livreurs.count || 0
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue dans votre espace d'administration</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Articles */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Articles</h3>
              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                {stats.articles}
              </span>
            </div>
            <Link 
              href="/article"
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
            >
              Voir les articles
              <span>→</span>
            </Link>
          </div>

          {/* Clients */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Clients</h3>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                {stats.clients}
              </span>
            </div>
            <Link 
              href="/client"
              className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
            >
              Voir les clients
              <span>→</span>
            </Link>
          </div>

          {/* Commandes */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Commandes</h3>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {stats.orders}
              </span>
            </div>
            <Link 
              href="/order"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              Voir les commandes
              <span>→</span>
            </Link>
          </div>

          {/* Livreurs */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Livreurs</h3>
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                {stats.livreurs}
              </span>
            </div>
            <Link 
              href="/delivery_man"
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
            >
              Voir les livreurs
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/create_article"
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-4 rounded-lg transition-colors duration-200 flex items-center gap-3"
            >
              <span className="text-xl">+</span>
              <span>Nouvel article</span>
            </Link>
            <Link
              href="/create_client"
              className="bg-green-50 hover:bg-green-100 text-green-600 p-4 rounded-lg transition-colors duration-200 flex items-center gap-3"
            >
              <span className="text-xl">+</span>
              <span>Nouveau client</span>
            </Link>
            <Link
              href="/create_order"
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-4 rounded-lg transition-colors duration-200 flex items-center gap-3"
            >
              <span className="text-xl">+</span>
              <span>Nouvelle commande</span>
            </Link>
            <Link
              href="/create_delivery_man"
              className="bg-purple-50 hover:bg-purple-100 text-purple-600 p-4 rounded-lg transition-colors duration-200 flex items-center gap-3"
            >
              <span className="text-xl">+</span>
              <span>Nouveau livreur</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 