'use client'

import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/database.types';
import { use, useEffect, useState } from 'react';
import data_orders from '../../../datas/data_orders';


export default function Ready_to_deliever({ params }: { params: Promise<{ id: string }> }) {
    const idDelieveryMan = parseInt(use(params).id);

    console.log("id livreur : ", idDelieveryMan)

    const [orders, setOrders] = useState<Tables<"order">[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Tables<"order">[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const data = await data_orders();
              setOrders(data);
                setFilteredOrders(data);
                setIsLoading(false);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };
    fetchOrders();
    }, []);

     

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    const handleTakeOrder = async (orderId: number) => {
        console.log(`Commande ${orderId} prise en compte`);

        const supabase =  createClient();
        const { error } = await supabase.from('order')
        .update({ status: 'delivering' })
        .eq('id', orderId);

        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Order updated successfully');
        }
    }
    return (

      <div>
        <h1>Commandes prêtes à être livrées   </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
                <div key={order.id}>
                    <h2>{order.id}</h2>
                    <p>{order.status}</p> 
                    <p>{order.delivery_address}</p>
                    <p>{order.name_client}</p>
                    <button 
                    onClick={() => handleTakeOrder(order.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                        prendre en compte la commande
                        </button>
                    
                    
                </div>
            ))}
        </div>
      </div>
    );
  }
  