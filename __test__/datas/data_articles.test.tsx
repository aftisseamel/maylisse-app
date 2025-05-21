import data_articles from '@/datas/data_articles';
import { createClient } from '@/utils/supabase/server';

jest.mock('@/utils/supabase/server');

describe('data_articles', () => {
  const mockSelect = jest.fn();
  const mockFrom = jest.fn(() => ({ select: mockSelect }));

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // bloque console.error dans tous les tests
  });

  it('should return data when no error', async () => {
    const fakeData = [{ id: 1, name: 'Article 1' }];

    (createClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });
    mockSelect.mockResolvedValue({ data: fakeData, error: null });

    const result = await data_articles();

    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('article');
    expect(mockSelect).toHaveBeenCalled();
    expect(result).toEqual(fakeData);
  });

  it('should return empty array on error', async () => {
    const fakeError = new Error('Failed to fetch');

    (createClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });
    mockSelect.mockResolvedValue({ data: null, error: fakeError });

    const result = await data_articles();

    expect(result).toEqual([]);
  });
});
