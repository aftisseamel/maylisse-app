import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeliveryManNavigationBar from '@/components/DeliveryManNavigationBar';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('DeliveryManNavigationBar', () => {
  it('should call signOut and redirect to /login on logout click', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    const signOutMock = jest.fn().mockResolvedValue({});
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: signOutMock,
      },
    });

    render(<DeliveryManNavigationBar />);

    const logoutButton = screen.getByText('Déconnexion');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });
});
