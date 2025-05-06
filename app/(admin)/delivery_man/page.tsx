'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function DeliveryManPage() {
  const [deliveryMen, setDeliveryMen] = useState<Tables<"delivery_man">[]>([]);
  const [filteredDeliveryMen, setFilteredDeliveryMen] = useState<Tables<"delivery_man">[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryMen = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('delivery_man')
          .select('*')
          .order('created_at', { ascending: false });

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
      deliveryMan.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDeliveryMen(filtered);
  }, [searchTerm, deliveryMen]);

  // Toggle le statut du livreur
  const toggleStatus = async (id: number, currentStatus: 'available' | 'unavailable') => {
    try {
      const supabase = createClient();
      const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
      
      const { error } = await supabase
        .from('delivery_man')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Mettre à jour l'état local
      setDeliveryMen(deliveryMen.map(dm => 
        dm.id === id ? { ...dm, status: newStatus } : dm
      ));
      setFilteredDeliveryMen(filteredDeliveryMen.map(dm => 
        dm.id === id ? { ...dm, status: newStatus } : dm
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

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
        {/* En-tête avec titre, recherche et bouton de création */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-800">Livreurs</h1>
              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                {filteredDeliveryMen.length} livreurs
              </span>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Rechercher un livreur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Link
                href="/create_delivery_man"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <span className="text-xl">+</span>
                <span>Nouveau livreur</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Liste des livreurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeliveryMen.map((deliveryMan) => (
            <div key={deliveryMan.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{deliveryMan.pseudo_delivery_man}</h3>
                  <button
                    onClick={() => toggleStatus(deliveryMan.id, deliveryMan.status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      deliveryMan.status === 'available'
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    {deliveryMan.status === 'available' ? 'Disponible' : 'Indisponible'}
                  </button>
                </div>

                <div className="space-y-2 mb-4">
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
            </div>
          ))}
        </div>

        {/* Message si aucun livreur */}
        {filteredDeliveryMen.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">Aucun livreur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
} 