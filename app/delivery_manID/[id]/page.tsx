'use client';

import { useState, useEffect, use } from 'react';
import { Tables } from '@/database.types';
import { createClient } from '@/utils/supabase/client';
import data_orders from '@/datas/data_orders';
import DeliveryManNavigationBar from '@/components/DeliveryManNavigationBar';

type orderStatus = 'prepared' | 'delivering' | 'delivered' | 'finished';


export default function DeliveryManPage({ params }: { params: Promise<{ id: string }> }) {
    const idDelieveryMan = parseInt(use(params).id);
    const [deliveryMan, setDeliveryMan] = useState<Tables<"delivery_man"> | null>(null);
    const [orders, setOrders] = useState<Tables<"order">[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState<{ [key: number]: string }>({});
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const toggleDeliveryManStatus = async () => {
        if (!deliveryMan) return;
        
        try {
            const supabase = createClient();
            const newStatus = deliveryMan.status === 'available' ? 'unavailable' : 'available';
            
            const { error } = await supabase
                .from('delivery_man')
                .update({ status: newStatus })
                .eq('id', idDelieveryMan);

            if (error) throw error;

            setDeliveryMan(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) {
            console.error('Error updating delivery man status:', error);
            alert('Une erreur est survenue lors de la mise à jour du statut');
        }
    };

    const updateOrderStatus = async (orderId: number, currentStatus: string) => {
        try {
            const supabase = createClient();
            let newStatus: 'delivering' | 'delivered' | 'finished';

            if (currentStatus === 'prepared') {
                newStatus = 'delivering';
            } else if (currentStatus === 'delivering') {
                newStatus = 'delivered';
            } else if (currentStatus === 'delivered') {
                newStatus = 'finished';
            } else {
                throw new Error('Invalid status');
            }
            
            const { error } = await supabase
                .from('order')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) {
                console.error('Error updating order:', error);
                throw error;
            }

            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId 
                        ? { ...order, status: newStatus }
                        : order
                )
            );

        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Une erreur est survenue lors de la mise à jour de la commande');
        }
    };

    const handleCommentChange = (orderId: number, comment: string) => {
        setComments(prev => ({
            ...prev,
            [orderId]: comment
        }));
        const supabase = createClient();

        try {
        const  error = supabase
            .from('order')
            .update({ 'comment_order_deliveryman': comment })
            .eq('id', orderId)
            .then(({ error }: { error: any }) => {
                if (error) {
                    console.error('Error updating comment:', error);
                    alert('Une erreur est survenue lors de la mise à jour du commentaire');
                }
            });
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('Une erreur est survenue lors de la mise à jour du commentaire');
        }
       
    };

    useEffect(() => {
        const fetchDeliveryManData = async () => {
            try {
                const supabase = createClient();
                
                const { data: deliveryManData, error: deliveryManError } = await supabase
                    .from('delivery_man')
                    .select('*')
                    .eq('id', idDelieveryMan)
                    .single();

                if (deliveryManError) throw deliveryManError;
                setDeliveryMan(deliveryManData);

                const allOrders = await data_orders();
                const deliveryManOrders = allOrders.filter((o: Tables<"order">) => 
                    o.pseudo_delivery_man === deliveryManData.pseudo_delivery_man && 
                    ['prepared', 'delivering', 'delivered', 'finished'].includes(o.status as orderStatus)
                );
                setOrders(deliveryManOrders);

            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeliveryManData();
    }, [idDelieveryMan]);

    const filteredOrders = orders.filter(order => 
        statusFilter === 'all' || order.status === statusFilter
    );

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
                        <DeliveryManNavigationBar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Commandes à livrer par {deliveryMan.pseudo_delivery_man}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p>Email : {deliveryMan.email}</p>
                    <p>Tel : {deliveryMan.phone}</p>
                    </div>
                        
                        <button
                            onClick={toggleDeliveryManStatus}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                deliveryMan.status === 'available'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                        >
                            {deliveryMan.status === 'available' ? 'Disponible' : 'Indisponible'}
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">Changer le statut :</p>
                        <select
                            value={deliveryMan.status}
                            onChange={(e) => {
                                const newStatus = e.target.value as 'available' | 'unavailable';
                                if (deliveryMan) {
                                    setDeliveryMan({ ...deliveryMan, status: newStatus });
                                    toggleDeliveryManStatus();
                                }
                            }}
                            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="available">Disponible</option>
                            <option value="unavailable">Indisponible</option>
                        </select>
                    </div>
                </div>
                
                <div className="mb-6">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="prepared">À livrer</option>
                        <option value="delivering">En cours de livraison</option>
                        <option value="delivered">Livré</option>
                        <option value="finished">Terminé</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Commande #{order.id}
                                </h2>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                    order.status === 'prepared' ? 'bg-purple-100 text-purple-800' : 
                                    order.status === 'delivering' ? 'bg-green-100 text-green-800' :
                                    'bg-blue-100 text-blue-800'
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

                                {order.status === 'delivered' && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Commentaire</p>
                                        <textarea
                                            value={comments[order.id] || ''}
                                            onChange={(e) => handleCommentChange(order.id, e.target.value)}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            rows={3}
                                            placeholder="Ajouter un commentaire sur la livraison..."
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 space-y-2">
                                {order.status !== 'finished' && (
                                    <button 
                                        onClick={() => updateOrderStatus(order.id, order.status)}
                                        className={`w-full px-4 py-2 rounded-lg transition-colors ${
                                            order.status === 'prepared' 
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                : order.status === 'delivering'
                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                : 'bg-blue-600 hover:bg-blue-800 text-white'
                                        }`}
                                    >
                                        {order.status === 'prepared' 
                                            ? 'Commencer la livraison' 
                                            : order.status === 'delivering' 
                                            ? 'Marquer comme livré'
                                            : 'Terminer la commande'}
                                    </button>
                                )}
                            </div>
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
