'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import SearchBarClients from "../../components/SearchBarClients";
import data_clients from "../../datas/data_clients";
import NavigationBar from '@/app/components/NavigationBar';
import { createClient } from '@/utils/supabase/client';

export default function Page() {
  const [clients, setClients] = useState<Tables<"client">[]>([]);
  const [filteredClients, setFilteredClients] = useState<Tables<"client">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editClientId, setEditClientId] = useState<number | null>(null);
  const [editedClientData, setEditedClientData] = useState<Partial<Tables<"client">>>({});
  const [clientOrders, setClientOrders] = useState<{ [key: string]: Tables<"order">[] }>({});

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await data_clients();
        setClients(data);
        setFilteredClients(data);
        
        // Récupérer les commandes pour chaque client
        const supabase = createClient();
        const { data: ordersData, error } = await supabase
          .from('order')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Organiser les commandes par client
        const ordersByClient = ordersData.reduce((acc, order) => {
          const clientName = order.name_client;
          if (!acc[clientName]) {
            acc[clientName] = [];
          }
          acc[clientName].push(order);
          return acc;
        }, {} as { [key: string]: Tables<"order">[] });

        setClientOrders(ordersByClient);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleSearchResults = (results: Tables<"client">[]) => {
    setFilteredClients(results);
  };

  const handleEditClient = (client: Tables<"client">) => {
    setEditClientId(client.id);
    setEditedClientData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address_client: client.address_client
    });
  };

  const handleInputChange = (field: keyof Tables<"client">, value: string) => {
    setEditedClientData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveClient = async (clientId: number) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("client")
      .update(editedClientData)
      .eq("id", clientId);

    if (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } else {
      const updatedClients = clients.map(client =>
        client.id === clientId ? { ...client, ...editedClientData } : client
      );
      setClients(updatedClients);
      setFilteredClients(updatedClients);
      setEditClientId(null);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">Clients</h1>
            <div className="flex items-center gap-4">
              <div className="w-full md:w-80">
                <SearchBarClients clients={clients} onSearchResults={handleSearchResults} />
              </div>
              <Link
                href="/create_client"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <span className="text-xl">+</span>
                <span>Créer un client</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                {editClientId === client.id ? (
                  <div className="space-y-3">
                    <input
                      value={editedClientData.name || ''}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Nom"
                    />
                    <input
                      value={editedClientData.email || ''}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Email"
                    />
                    <input
                      value={editedClientData.phone || ''}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Téléphone"
                    />
                    <input
                      value={editedClientData.address_client || ''}
                      onChange={e => handleInputChange('address_client', e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Adresse"
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleSaveClient(client.id)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setEditClientId(null)}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-800">{client.name}</h3>
                      <button
                        onClick={() => handleEditClient(client)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Modifier"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {client.email}
                      </p>
                      {client.phone && (
                        <p className="text-gray-600">
                          <span className="font-medium">Téléphone:</span> {client.phone}
                        </p>
                      )}
                      {client.address_client && (
                        <p className="text-gray-600">
                          <span className="font-medium">Adresse:</span> {client.address_client}
                        </p>
                      )}
                      
                      {/* Bouton pour voir les commandes */}
                      <div className="mt-4">
                        <Link
                          href={`/clientID/${client.name}`}
                          className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                        >
                          Voir les commandes
                          {clientOrders[client.name] && clientOrders[client.name].length > 0 && (
                            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium">
                              {clientOrders[client.name].length}
                            </span>
                          )}
                        </Link>
                      </div>

                
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <p className="text-center py-4">Aucun client trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
}
