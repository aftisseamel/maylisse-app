import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function NavigationBar() {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex space-x-4">
                        <Link
                            href="/admin"
                            className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        >
                            Home
                        </Link>
                        <Link
                            href="/article"
                            className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        >
                            Articles
                        </Link>
                        <Link
                            href="/order"
                            className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        >
                            Commandes
                        </Link>
                        <Link
                            href="/client"
                            className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        >
                            Clients
                        </Link>
                        <Link
                            href="/delivery_man"
                            className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        >
                            Livreurs
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 