
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const clientSupabase = await createClient();
    const {data : {user}} = await clientSupabase.auth.getUser();
  
    const {data, error} = await clientSupabase.from('profiles').select('role_profile').eq('id', user!.id).single();
    if (error || !data || data.role_profile !== 'admin') {
     notFound()
    }
  return (
   children
  );
}
