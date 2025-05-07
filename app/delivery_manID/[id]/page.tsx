'use client';

import { useState, useEffect, use } from 'react';
import { Tables } from '@/database.types';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import data_orders from '@/app/data_orders';

export default function DeliveryManPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [deliveryMan, setDeliveryMan] = useState<Tables<"delivery_man"> | null>(null);
    const [orders, setOrders] = useState<Tables<"order">[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

                // Récupérer les commandes du livreur
                const allOrders = await data_orders();
                const deliveryManOrders = allOrders.filter(o => o.pseudo_delivery_man === deliveryManData.pseudo_delivery_man);
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
        return <div>Chargement...</div>;
    }

    if (!deliveryMan) {
        return <div>Livreur non trouvé</div>;
    }

    return (
        <div>
            <h1>Commandes de {deliveryMan.pseudo_delivery_man}</h1>
            {orders.map((order) => (
                <div key={order.id}>
                    <h2>Commande #{order.id}</h2>
                    <p>Status: {order.status}</p>
                    <p>Adresse: {order.delivery_address}</p>
                    <p>Client: {order.name_client}</p>
                </div>
            ))}
        </div>
    );
}
