'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function Page() {
  const [deliveryMen, setDeliveryMen] = useState<Tables<"delivery_man">[]>([]);
  const [filteredDeliveryMen, setFilteredDeliveryMen] = useState<Tables<"delivery_man">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les livreurs au démarrage
  useEffect(() => {
    const fetchDeliveryMen = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('delivery_man')
          .select('*');

        if (error) throw error;
        
        setDeliveryMen(data || []);
        setFilteredDeliveryMen(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeliveryMen();
  }, []);

  // Filtrer les livreurs
  useEffect(() => {
    const filtered = deliveryMen.filter(deliveryMan => 
      deliveryMan.pseudo_delivery_man?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryMan.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryMan.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryMan.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryMan.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDeliveryMen(filtered);
  }, [searchTerm, deliveryMen]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec titre et recherche */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Livreurs</h1>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Rechercher un livreur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Liste des livreurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeliveryMen.map((deliveryMan) => (
            <div key={deliveryMan.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold">{deliveryMan.pseudo_delivery_man}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600">
                  <span className="font-medium">Nom:</span> {deliveryMan.first_name} {deliveryMan.last_name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {deliveryMan.email}
                </p>
                {deliveryMan.phone && (
                  <p className="text-gray-600">
                    <span className="font-medium">Téléphone:</span> {deliveryMan.phone}
                  </p>
                )}
                {deliveryMan.address_delivery_man && (
                  <p className="text-gray-600">
                    <span className="font-medium">Adresse:</span> {deliveryMan.address_delivery_man}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun livreur */}
        {filteredDeliveryMen.length === 0 && (
          <p className="text-center py-4">Aucun livreur trouvé</p>
        )}

        {/* Bouton de création */}
        <div className="text-center mt-6">
          <Link
            href="/create_delivery_man"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Créer un livreur
          </Link>
        </div>
      </div>
    </div>
  );
} 