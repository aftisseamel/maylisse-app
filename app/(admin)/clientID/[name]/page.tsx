'use client';

import { useState, useEffect, use } from 'react';
import { Tables } from '@/database.types';
import data_orders from '@/app/data_orders';
import data_clients from '@/app/data_clients';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

export default function ClientPage({ params }: { params: Promise<{ name: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    
    const [client, setClient] = useState<Tables<"client"> | null>(null);
    const [orders, setOrders] = useState<Tables<"order">[]>([]);
    const [isLoading, setIsLoading] = useState(true);
   

    useEffect(() => {
        const fetchClientData = async () => {
            try {                
                // Récupérer les informations du client
                const clients = await data_clients();
                console.log("clients : ", clients)
                
                const client = clients.find(c => c.name === decodeURIComponent(resolvedParams.name));
                setClient(client || null);

                // Récupérer les commandes du client
                const orders = await data_orders();
                const clientOrders = orders.filter(o => o.name_client === decodeURIComponent(resolvedParams.name));

                // Trier les commandes par statut
                const sortedOrders = clientOrders.sort((a, b) => {
                    const statusOrder = {
                        'initiated': 1,
                        'preparation': 2,
                        'prepared': 3,
                        'delivering': 4,
                        'delivered': 5,
                        'finished': 6
                    };
                    return (statusOrder[a.status as keyof typeof statusOrder] || 0) - 
                           (statusOrder[b.status as keyof typeof statusOrder] || 0);
                });
                setOrders(sortedOrders);


            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClientData();
    }, [resolvedParams.name]);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (!client) {
        return <div>Client non trouvé</div>;
    }


    return (

        <div className="p-4">
            <div className="max-w-6xl mx-auto">
                {/* En-tête avec informations du client */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-4">{client.name}</h1>
                            <div className="space-y-2">
                                <p><span className="font-semibold">Email:</span> {client.email}</p>
                                {client.phone && (
                                    <p><span className="font-semibold">Téléphone:</span> {client.phone}</p>
                                )}
                                {client.address_client && (
                                    <p><span className="font-semibold">Adresse:</span> {client.address_client}</p>
                                )}
                            </div>
                        </div>
                        <Link
                            href="/client"
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            Retour à la liste
                        </Link>
                    </div>
                </div>

                {/* Liste des commandes */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Commandes du client</h2>
                    {orders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {orders.map((order) => (
                                <div key={order.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold">Commande #{order.id}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                            ${order.status === 'initiated' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'preparation' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'prepared' ? 'bg-purple-100 text-purple-800' :
                                            order.status === 'delivering' ? 'bg-orange-100 text-orange-800' :
                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'finished' ? 'bg-gray-100 text-gray-800' :
                                            'bg-red-100 text-red-800'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-2">{order.delivery_address}</p>
                                    <p className="text-sm mt-2">
                                        <span className="font-semibold">Livreur:</span> {order.pseudo_delivery_man}
                                    </p>
                                    {order.description_order && (
                                        <p className="text-sm text-gray-600 mt-2">{order.description_order}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                                    </p>

                                    {order.status === 'initiated' && (
                                        <div>
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                            onClick={
                                                () => {
                                                    console.log("Ajouter des articles à la commande")
                                                    router.push('/addArticles')
                                                }

                                            }
                                            >
                                                <p> Ajouter des articles à la commande </p>
                                                
                                            </button>
                                        </div>
                                    )}
                                    
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-4">Aucune commande trouvée</p>
                    )}
                </div>
            </div>
        </div>
    );
} 