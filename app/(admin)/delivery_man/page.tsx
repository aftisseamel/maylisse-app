'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import NavigationBar from '@/app/components/NavigationBar';
import SearchBarDeliveryMan from '@/app/components/SearchBarDeliveryMan';

export default function DeliveryManPage() {
  const [deliveryMen, setDeliveryMen] = useState<Tables<"delivery_man">[]>([]);
  const [filteredDeliveryMen, setFilteredDeliveryMen] = useState<Tables<"delivery_man">[]>([]);
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

  const handleSearchResults = (results: Tables<"delivery_man">[]) => {
    setFilteredDeliveryMen(results);
  };

  const toggleStatus = async (id: number, currentStatus: 'available' | 'unavailable') => {
    try {
      const supabase = createClient();
      const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
      
      const { error } = await supabase
        .from('delivery_man')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

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
    <div>
      <NavigationBar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">Livreurs</h1>
            <div className="flex items-center gap-4">
              <div className="w-full md:w-80">
                <SearchBarDeliveryMan deliveryMen={deliveryMen} onSearchResults={handleSearchResults} />
              </div>
              <Link
                href="/create_delivery_man"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <span className="text-xl">+</span>
                <span>Nouveau livreur</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeliveryMen.map((deliveryMan) => (
              <div key={deliveryMan.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold">{deliveryMan.pseudo_delivery_man}</h3>
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

                <div className="space-y-2">
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

          {filteredDeliveryMen.length === 0 && (
            <p className="text-center py-4">Aucun livreur trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
} 