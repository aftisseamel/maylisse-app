import { render, screen } from '@testing-library/react';
import SearchBarClients from '@/components/SearchBarClients';
import { Tables } from '@/database.types';

describe('SearchBarClients', () => {
  const mockClients: Tables<'client'>[] = [];
  const mockOnSearchResults = jest.fn();

  it('renders without crashing and shows the input', () => {
    render(<SearchBarClients clients={mockClients} onSearchResults={mockOnSearchResults} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
