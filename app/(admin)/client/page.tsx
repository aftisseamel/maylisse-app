'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/database.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import data_clients from '@/app/data_clients';
export default function Page() {
  const router = useRouter();
  const [clients, setClients] = useState<Tables<"client">[]>([]);
  const [filteredClients, setFilteredClients] = useState<Tables<"client">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les clients au démarrage
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const client = await data_clients();

        
        setClients(client || []);
        setFilteredClients(client || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  // Filtrer les clients
  useEffect(() => {
    const filtered = clients.filter(client => 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec titre et recherche */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Clients</h1>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Liste des clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div key={client.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold">{client.name}</h3>
              <div className="mt-2 space-y-1">
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
                <button 
                type="button"
                onClick={() => {

                  router.push(`/clientID/${client.name}`);
                }}
                >
                  Voir les commandes
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun client */}
        {filteredClients.length === 0 && (
          <p className="text-center py-4">Aucun client trouvé</p>
        )}

        {/* Bouton de création */}
        <div className="text-center mt-6">
          <Link
            href="/create_client"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Créer un client
          </Link>
        </div>
      </div>
    </div>
  );
}
