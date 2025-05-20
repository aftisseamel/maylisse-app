import { render, screen } from '@testing-library/react';
import NavigationBar from '@/components/NavigationBar';
import '@testing-library/jest-dom';

describe('NavigationBar', () => {
  beforeEach(() => {
    render(<NavigationBar />);
  });

  it('rend tous les liens avec les bons textes', () => {
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Commandes')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Livreurs')).toBeInTheDocument();
  });

  it('chaque lien a le bon href', () => {
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/admin');
    expect(screen.getByText('Articles').closest('a')).toHaveAttribute('href', '/article');
    expect(screen.getByText('Commandes').closest('a')).toHaveAttribute('href', '/order');
    expect(screen.getByText('Clients').closest('a')).toHaveAttribute('href', '/client');
    expect(screen.getByText('Livreurs').closest('a')).toHaveAttribute('href', '/delivery_man');
  });
});
