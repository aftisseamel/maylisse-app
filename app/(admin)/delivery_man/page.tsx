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
  const [editDeliveryManId, setEditDeliveryManId] = useState<number | null>(null);
  const [editedDeliveryManData, setEditedDeliveryManData] = useState<Partial<Tables<"delivery_man">>>({});

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

  const handleEditDeliveryMan = (deliveryMan: Tables<"delivery_man">) => {
    setEditDeliveryManId(deliveryMan.id);
    setEditedDeliveryManData({
      pseudo_delivery_man: deliveryMan.pseudo_delivery_man,
      first_name: deliveryMan.first_name,
      last_name: deliveryMan.last_name,
      email: deliveryMan.email,
      phone: deliveryMan.phone,
      address_delivery_man: deliveryMan.address_delivery_man,
      status: deliveryMan.status
    });
  };

  const handleInputChange = (field: keyof Tables<"delivery_man">, value: string) => {
    setEditedDeliveryManData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDeliveryMan = async (deliveryManId: number) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("delivery_man")
      .update(editedDeliveryManData)
      .eq("id", deliveryManId);

    if (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } else {
      const updatedDeliveryMen = deliveryMen.map(dm =>
        dm.id === deliveryManId ? { ...dm, ...editedDeliveryManData } : dm
      );
      setDeliveryMen(updatedDeliveryMen);
      setFilteredDeliveryMen(updatedDeliveryMen);
      setEditDeliveryManId(null);
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
              <div key={deliveryMan.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                {editDeliveryManId === deliveryMan.id ? (
                  <div className="space-y-3">
                    <input
                      value={editedDeliveryManData.pseudo_delivery_man || ''}
                      onChange={e => handleInputChange('pseudo_delivery_man', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Pseudo"
                    />
                    <input
                      value={editedDeliveryManData.first_name || ''}
                      onChange={e => handleInputChange('first_name', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Prénom"
                    />
                    <input
                      value={editedDeliveryManData.last_name || ''}
                      onChange={e => handleInputChange('last_name', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Nom"
                    />
                    <input
                      value={editedDeliveryManData.email || ''}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Email"
                    />
                    <input
                      value={editedDeliveryManData.phone || ''}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Téléphone"
                    />
                    <input
                      value={editedDeliveryManData.address_delivery_man || ''}
                      onChange={e => handleInputChange('address_delivery_man', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Adresse"
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleSaveDeliveryMan(deliveryMan.id)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setEditDeliveryManId(null)}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-800">{deliveryMan.pseudo_delivery_man}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditDeliveryMan(deliveryMan)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          title="Modifier"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
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
                  </>
                )}
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