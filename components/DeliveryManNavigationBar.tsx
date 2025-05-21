import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function DeliveryManNavigationBar() {
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
                    <div className="flex items-center">
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