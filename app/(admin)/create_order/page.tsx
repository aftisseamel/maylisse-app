'use client'

import { useTransition, useState, useEffect } from "react";
import { createOrder } from "./action";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/database.types';
import Select from '@/components/Select';
import Input from '@/components/Input';
import NavigationBar from '@/components/NavigationBar';

export default function CreateOrder() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [deliveryMen, setDeliveryMen] = useState<Tables<"delivery_man">[]>([]);
    const [clients, setClients] = useState<Tables<"client">[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        delivery_address: '',
        pseudo_delivery_man: '',
        name_client: '',
        description_order: '',
        status: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            
            const { data: deliveryMenData, error: deliveryMenError } = await supabase
                .from('delivery_man')
                .select('*')
                .order('pseudo_delivery_man');

            if (deliveryMenError) {
                console.error('Error fetching delivery men:', deliveryMenError);
                setError('Erreur lors du chargement des livreurs');
                return;
            }

            const { data: clientsData, error: clientsError } = await supabase
                .from('client')
                .select('*')
                .order('name');

            if (clientsError) {
                console.error('Error fetching clients:', clientsError);
                setError('Erreur lors du chargement des clients');
                return;
            }

            setDeliveryMen(deliveryMenData || []);
            setClients(clientsData || []);
        };

        fetchData();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!formData.description_order.trim()) {
            setError('La description de la commande est requise');
            return;
        }

        if (!formData.pseudo_delivery_man) {
            setError('Veuillez sélectionner un livreur');
            return;
        }

        if (!formData.name_client) {
            setError('Veuillez sélectionner un client');
            return;
        }

        const formDataObj = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) { 
                formDataObj.append(key, value);
            }
        });

        startTransition(async () => {
            const result = await createOrder(formDataObj);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                router.push('/order');
            }
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || null 
        }));
    };

    const statusOptions = [
        { value: 'initiated', label: 'Initialisée' },
        { value: 'preparation', label: 'En préparation' },
        { value: 'prepared', label: 'Préparée' },
        { value: 'delivering', label: 'En livraison' },
        { value: 'delivered', label: 'Livrée' },
        { value: 'finished', label: 'Terminée' },
        { value: 'canceled', label: 'Annulée' }
    ];

    return (
        <div>
            <NavigationBar />
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Créer une commande</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        name="delivery_address" 
                        label="Adresse de livraison"
                        placeholder="Adresse de livraison" 
                        required 
                        value={formData.delivery_address}
                        onChange={handleInputChange}
                    />
                    
                    <Select
                        name="pseudo_delivery_man"
                        label="Livreur"
                        options={deliveryMen.map(dm => ({
                            value: dm.pseudo_delivery_man,
                            label: (
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium">{dm.pseudo_delivery_man}</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        dm.status === 'available' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {dm.status === 'available' ? 'Disponible' : 'Indisponible'}
                                    </span>
                                </div>
                            )
                        }))}
                        required
                        searchable
                        value={formData.pseudo_delivery_man}
                        onChange={handleSelectChange}
                    />

                    <Select
                        name="name_client"
                        label="Client"
                        options={clients.map(client => ({
                            value: client.name,
                            label: client.name
                        }))}
                        required
                        searchable
                        value={formData.name_client}
                        onChange={handleSelectChange}
                    />

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description_order"
                            placeholder="Description de la commande"
                            required
                            value={formData.description_order}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]"
                        />
                    </div>

                    <Select
                        name="status"
                        label="Statut"
                        options={statusOptions}
                        required
                        value={formData.status}
                        onChange={handleSelectChange}
                    />

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                    >
                        {isPending ? 'Création...' : 'Créer'}
                    </button>
                </form>

                <Link href="/order" className="text-indigo-600 hover:underline mt-4 block text-center">
                    Retour à la liste des commandes
                </Link>
            </div>
        </div>
    );
}
