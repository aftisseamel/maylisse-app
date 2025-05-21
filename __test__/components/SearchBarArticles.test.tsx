import { render, screen } from '@testing-library/react';
import SearchBar from '@/components/SearchBarArticles';
import { Tables } from '@/database.types';

describe('SearchBar', () => {
  const mockArticles: Tables<'article'>[] = [];
  const mockOnSearchResults = jest.fn();

  it('renders without crashing and shows the input', () => {
    render(<SearchBar articles={mockArticles} onSearchResults={mockOnSearchResults} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
