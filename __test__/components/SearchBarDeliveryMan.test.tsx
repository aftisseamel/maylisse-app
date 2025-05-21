import { render, screen } from '@testing-library/react';
import SearchBarDeliveryMan from '@/components/SearchBarDeliveryMan';
import { Tables } from '@/database.types';

describe('SearchBarDeliveryMan', () => {
  const mockDeliveryMen: Tables<'delivery_man'>[] = [];
  const mockOnSearchResults = jest.fn();

  it('renders without crashing and shows the input', () => {
    render(<SearchBarDeliveryMan deliveryMen={mockDeliveryMen} onSearchResults={mockOnSearchResults} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
