'use client';

import { useState, useEffect, use } from 'react';
import { Tables } from '@/database.types';
import { createClient } from '@/utils/supabase/client';
import data_orders from '@/app/data_orders';

export default function DeliveryManPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [deliveryMan, setDeliveryMan] = useState<Tables<"delivery_man"> | null>(null);
    const [orders, setOrders] = useState<Tables<"order">[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<string | null>(null);
    const handleStatus = (status: string) => {
        setStatus(status);
    }

    const updateOrderStatus = async (orderId: number) => {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('order')
                .update({ status: 'delivering' })
                .eq('id', orderId);

            if (error) throw error;

            // Mettre à jour la liste des commandes
            const allOrders = await data_orders();
            const deliveryManOrders = allOrders.filter(o => 
                o.pseudo_delivery_man === deliveryMan?.pseudo_delivery_man && 
                (o.status === 'prepared' || o.status === 'delivering')
            );
            setOrders(deliveryManOrders);

        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    useEffect(() => {
        const fetchDeliveryManData = async () => {
            try {
                const supabase = createClient();
                
                // Récupérer les informations du livreur
                const { data: deliveryManData, error: deliveryManError } = await supabase
                    .from('delivery_man')
                    .select('*')
                    .eq('id', parseInt(resolvedParams.id))
                    .single();

                if (deliveryManError) throw deliveryManError;
                setDeliveryMan(deliveryManData);

                // Récupérer les commandes du livreur avec status 'prepared' ou 'delivering'
                const allOrders = await data_orders();
                const deliveryManOrders = allOrders.filter(o => 
                    o.pseudo_delivery_man === deliveryManData.pseudo_delivery_man && 
                    (o.status === 'prepared' || o.status === 'delivering')
                );
                setOrders(deliveryManOrders);

            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeliveryManData();
    }, [resolvedParams.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!deliveryMan) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Livreur non trouvé</h2>
                    <p className="text-gray-600 mt-2">Le livreur que vous recherchez n'existe pas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Commandes à livrer pour {deliveryMan.pseudo_delivery_man}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                        <p>{deliveryMan.email}</p>
                        {deliveryMan.phone && <p>• {deliveryMan.phone}</p>}
                    </div>
                </div>

                {/* Liste des commandes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Commande #{order.id}
                                </h2>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                    order.status === 'prepared' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Adresse de livraison</p>
                                    <p className="text-gray-900">{order.delivery_address}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Client</p>
                                    <p className="text-gray-900">{order.name_client}</p>
                                </div>

                                {order.description_order && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Description</p>
                                        <p className="text-gray-900">{order.description_order}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date de création</p>
                                    <p className="text-gray-900">
                                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={() => updateOrderStatus(order.id)}
                                className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Commencer la livraison
                            </button>
                        </div>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Aucune commande à livrer</p>
                    </div>
                )}
            </div>
        </div>
    );
}
