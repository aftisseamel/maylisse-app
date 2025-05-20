import { render, screen } from '@testing-library/react';
import SearchBarOrder from '@/components/SearchBarOrders';
import { Tables } from '@/database.types';

describe('SearchBarOrder', () => {
    const mockOrders: Tables<"order">[] = [];
    const mockOnSearchResults = jest.fn();

    it('renders without crashing', () => {
        render(<SearchBarOrder orders={mockOrders} onSearchResults={mockOnSearchResults} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
}); 