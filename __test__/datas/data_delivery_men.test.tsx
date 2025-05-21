import data_delivery_men from '@/datas/data_delivery_men';
import { createClient } from '@/utils/supabase/server';

jest.mock('@/utils/supabase/server');

describe('data_delivery_men', () => {
  const mockOrder = jest.fn();
  const mockSelect = jest.fn(() => ({ order: mockOrder }));
  const mockFrom = jest.fn(() => ({ select: mockSelect }));

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // masque console.error en test
  });

  it('should return delivery men data when no error', async () => {
    const fakeData = [
      { id: 1, pseudo_delivery_man: 'Alpha' },
      { id: 2, pseudo_delivery_man: 'Bravo' },
    ];

    (createClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });

    mockOrder.mockResolvedValue({ data: fakeData, error: null });

    const result = await data_delivery_men();

    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('delivery_man');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('pseudo_delivery_man', { ascending: true });
    expect(result).toEqual(fakeData);
  });

  it('should return empty array and log error if Supabase returns error', async () => {
    const fakeError = new Error('Fetch failed');

    (createClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });

    mockOrder.mockResolvedValue({ data: null, error: fakeError });

    const result = await data_delivery_men();

    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error fetching delivery men:', fakeError);
  });

  it('should return empty array and log error if function throws', async () => {
    (createClient as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const result = await data_delivery_men();

    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error in data_delivery_men:', expect.any(Error));
  });
});
