import { createClient } from '@/utils/supabase/client';
import data_clients from '@/app/datas/data_clients';

jest.mock('@/utils/supabase/client');

describe('data_clients', () => {
    it('should return an array', async () => {
        const mockSupabase = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: [], error: null })
        };

        (createClient as jest.Mock).mockReturnValue(mockSupabase);

        const result = await data_clients();
        expect(Array.isArray(result)).toBe(true);
    });
}); 