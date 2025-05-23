import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavigationBar from '@/components/NavigationBar';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// Mock des dépendances
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('NavigationBar', () => {
  it('should logout and redirect to /login when clicking Déconnexion', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    const signOutMock = jest.fn().mockResolvedValue({});
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: signOutMock,
      },
    });

    render(<NavigationBar />);

    const logoutButton = screen.getByText('Déconnexion');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  it('should render all navigation links', () => {
    render(<NavigationBar />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Commandes')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Livreurs')).toBeInTheDocument();
  });
});
