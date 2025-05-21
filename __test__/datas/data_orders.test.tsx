import data_orders from '@/datas/data_orders';
import { createClient } from '@/utils/supabase/server';

jest.mock('@/utils/supabase/server');

describe('data_orders', () => {
  const mockOrder = jest.fn();
  const mockSelect = jest.fn(() => ({ order: mockOrder }));
  const mockFrom = jest.fn(() => ({ select: mockSelect }));

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // masque console.error dans les tests
  });

  it('should return order data when no error', async () => {
    const fakeData = [
      { id: 1, created_at: '2023-05-20', item: 'Item A' },
      { id: 2, created_at: '2023-05-19', item: 'Item B' },
    ];

    (createClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });

    mockOrder.mockResolvedValue({ data: fakeData, error: null });

    const result = await data_orders();

    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('order');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(result).toEqual(fakeData);
  });

  it('should return empty array and log error if Supabase returns error', async () => {
    const fakeError = new Error('Fetch failed');

    (createClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });

    mockOrder.mockResolvedValue({ data: null, error: fakeError });

    const result = await data_orders();

    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error fetching orders:', fakeError);
  });

  it('should return empty array and log error if function throws', async () => {
    (createClient as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const result = await data_orders();

    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error in data_orders:', expect.any(Error));
  });
});
