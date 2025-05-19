'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import SearchBarClients from "../../components/SearchBarClients";
import data_clients from "../../datas/data_clients";
import NavigationBar from '@/app/components/NavigationBar';

export default function Page() {
  const [clients, setClients] = useState<Tables<"client">[]>([]);
  const [filteredClients, setFilteredClients] = useState<Tables<"client">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await data_clients();
        setClients(data);
        setFilteredClients(data);
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
            <div className="w-full md:w-80">
              <SearchBarClients clients={clients} onSearchResults={handleSearchResults} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold">{client.name}</h3>
                <p className="text-gray-600">{client.email}</p>
                {client.phone && (
                  <p className="text-gray-600">Téléphone: {client.phone}</p>
                )}
                {client.address_client && (
                  <p className="text-gray-600">Adresse: {client.address_client}</p>
                )}
                <Link
                  href={`/clientID/${client.name}`}
                  className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Voir les commandes
                </Link>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <p className="text-center py-4">Aucun client trouvé</p>
          )}

          <div className="text-center mt-6">
            <Link
              href="/create_client"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Créer un client
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
