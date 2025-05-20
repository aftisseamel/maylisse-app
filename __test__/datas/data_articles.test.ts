import data_articles from '@/datas/data_articles';
import { createClient } from '@/utils/supabase/server';

jest.mock('@/utils/supabase/server');

describe('data_articles', () => {
  it('retourne les données quand la requête réussit', async () => {
    const mockData = [{ id: 1, name: 'Article 1' }, { id: 2, name: 'Article 2' }];
    const mockSelect = jest.fn().mockResolvedValue({ data: mockData, error: null });
    const mockFrom = jest.fn(() => ({ select: mockSelect }));
    (createClient as jest.Mock).mockResolvedValue({ from: mockFrom });

    const result = await data_articles();

    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('article');
    expect(mockSelect).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('retourne un tableau vide en cas d\'erreur', async () => {
    const mockError = new Error('Failed to fetch');
    const mockSelect = jest.fn().mockResolvedValue({ data: null, error: mockError });
    const mockFrom = jest.fn(() => ({ select: mockSelect }));
    (createClient as jest.Mock).mockResolvedValue({ from: mockFrom });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await data_articles();

    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('article');
    expect(mockSelect).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Error fetching articles:", mockError);
    expect(result).toEqual([]);

    consoleSpy.mockRestore();
  });
});
