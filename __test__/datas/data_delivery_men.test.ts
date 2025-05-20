import { createClient } from '@/utils/supabase/client';
import data_delivery_men from '@/app/datas/data_delivery_men';

jest.mock('@/utils/supabase/client');

describe('data_delivery_men', () => {
    it('should return an array', async () => {
        const mockSupabase = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: [], error: null })
        };

        (createClient as jest.Mock).mockReturnValue(mockSupabase);

        const result = await data_delivery_men();
        expect(Array.isArray(result)).toBe(true);
    });
}); 