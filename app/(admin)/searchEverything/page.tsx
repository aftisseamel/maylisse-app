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

  // Charger toutes les données au démarrage
  useEffect(() => {
    const fetchData = async () => {
      try {
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
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          Recherche Globale
        </h1>

        {/* Section Articles */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-3">Rechercher un article</h2>
          <SearchBar articles={articles} onSearchResults={() => {}} />
        </div>

        {/* Section Clients */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-3">Rechercher un client</h2>
          <SearchBarClients clients={clients} />
        </div>

        {/* Section Commandes */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-3">Rechercher une commande</h2>
          <SearchBarOrders orders={orders} />
        </div>

        {/* Section Livreurs */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Rechercher un livreur</h2>
          <SearchBarDeliveryMan deliveryMen={deliveryMen} />
        </div>
      </div>
    </div>
  );
}
