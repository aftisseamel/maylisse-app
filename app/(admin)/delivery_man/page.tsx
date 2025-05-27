'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import NavigationBar from '@/components/NavigationBar';
import SearchBarDeliveryMan from '@/components/SearchBarDeliveryMan';
import { deleteDeliveryMan } from './action';

export default function DeliveryManPage() {
  const [deliveryMen, setDeliveryMen] = useState<Tables<"delivery_man">[]>([]);
  const [filteredDeliveryMen, setFilteredDeliveryMen] = useState<Tables<"delivery_man">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDeliveryManId, setEditDeliveryManId] = useState<number | null>(null);
  const [editedDeliveryManData, setEditedDeliveryManData] = useState<Partial<Tables<"delivery_man">>>({});
  const [error, setError] = useState<string | null>(null);

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

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?')) {
      return;
    }

    const result = await deleteDeliveryMan(id);
    if (result.error) {
      setError(result.error);
      return;
    }

    setDeliveryMen(prev => prev.filter(dm => dm.id !== id));
    setFilteredDeliveryMen(prev => prev.filter(dm => dm.id !== id));
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
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Livreurs</h1>
            <Link
              href="/create_delivery_man"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ajouter un livreur
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <SearchBarDeliveryMan deliveryMen={deliveryMen} onSearchResults={handleSearchResults} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeliveryMen.map((deliveryMan) => (
              <div key={deliveryMan.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
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
                      <h2 className="text-xl font-semibold text-gray-900">
                        {deliveryMan.pseudo_delivery_man}
                      </h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditDeliveryManId(deliveryMan.id);
                            setEditedDeliveryManData(deliveryMan);
                          }}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(deliveryMan.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Supprimer
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
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${
                            deliveryMan.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          <span className="text-gray-600">
                            {deliveryMan.status === 'available' ? 'Disponible' : 'Indisponible'}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleStatus(deliveryMan.id, deliveryMan.status)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            deliveryMan.status === 'available'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {deliveryMan.status === 'available' ? 'Marquer indisponible' : 'Marquer disponible'}
                        </button>
                      </div>
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