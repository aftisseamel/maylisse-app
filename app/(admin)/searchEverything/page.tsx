'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/database.types';
import SearchBar from "../../components/SearchBarArticles";
import SearchBarClients from "../../components/SearchBarClients";
import SearchBarOrders from "../../components/SearchBarOrders";
import SearchBarDeliveryMan from "../../components/SearchBarDeliveryMan";

export default function SearchEverything() {
  const [articles, setArticles] = useState<Tables<"article">[]>([]);
  const [clients, setClients] = useState<Tables<"client">[]>([]);
  const [orders, setOrders] = useState<Tables<"order">[]>([]);
  const [deliveryMen, setDeliveryMen] = useState<Tables<"delivery_man">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();

        // Récupérer les articles
        const { data: articlesData } = await supabase.from('article').select('*');
        if (articlesData) setArticles(articlesData);

        // Récupérer les clients
        const { data: clientsData } = await supabase.from('client').select('*');
        if (clientsData) setClients(clientsData);

        // Récupérer les commandes
        const { data: ordersData } = await supabase.from('order').select('*');
        if (ordersData) setOrders(ordersData);

        // Récupérer les livreurs
        const { data: deliveryMenData } = await supabase.from('delivery_man').select('*');
        if (deliveryMenData) setDeliveryMen(deliveryMenData);

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Recherche Globale
        </h1>

        {/* Section Articles */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Rechercher un article</h2>
          <SearchBar articles={articles} />
        </div>

        {/* Section Clients */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Rechercher un client</h2>
          <SearchBarClients clients={clients} />
        </div>

        {/* Section Commandes */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Rechercher une commande</h2>
          <SearchBarOrders orders={orders} />
        </div>

        {/* Section Livreurs */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Rechercher un livreur</h2>
          <SearchBarDeliveryMan deliveryMen={deliveryMen} />
        </div>
      </div>
    </div>
  );
}
