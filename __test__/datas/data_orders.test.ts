import { createClient } from '@/utils/supabase/client';
import data_orders from '@/app/datas/data_orders';

jest.mock('@/utils/supabase/client');

describe('data_orders', () => {
    it('should return an array', async () => {
        const mockSupabase = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: [], error: null })
        };

        (createClient as jest.Mock).mockReturnValue(mockSupabase);

        const result = await data_orders();
        expect(Array.isArray(result)).toBe(true);
    });
}); 