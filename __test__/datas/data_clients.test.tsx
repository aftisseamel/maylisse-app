import data_clients from '@/datas/data_clients';
import { createClient } from '@/utils/supabase/server';

jest.mock('@/utils/supabase/server');

describe('data_clients', () => {
  const mockSelect = jest.fn();
  const mockFrom = jest.fn(() => ({ select: mockSelect }));

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // évite logs en test
    jest.spyOn(console, 'log').mockImplementation(() => {}); // masque console.log
  });

  it('should return client data when no error', async () => {
    const fakeData = [{ id: 1, name: 'Client 1' }];

    (createClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });
    mockSelect.mockResolvedValue({ data: fakeData, error: null });

    const result = await data_clients();

    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('client');
    expect(mockSelect).toHaveBeenCalled();
    expect(result).toEqual(fakeData);
  });

  it('should return empty array and log error when error occurs', async () => {
    const fakeError = new Error('Fetch failed');

    (createClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });
    mockSelect.mockResolvedValue({ data: null, error: fakeError });

    const result = await data_clients();

    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("Error fetching orders:", fakeError);
  });
});
