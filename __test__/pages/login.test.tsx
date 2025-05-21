import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import * as actions from '@/app/login/action';
import { act } from '@testing-library/react';

// Mock des actions server (login, signup, resetPassword)
jest.mock('@/app/login/action', () => ({
  login: jest.fn(),
  signup: jest.fn(),
  resetPassword: jest.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le formulaire de connexion initialement', () => {
    render(<LoginPage />);
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer un compte/i })).toBeInTheDocument();
    expect(screen.getByText(/mot de passe oublié \?/i)).toBeInTheDocument();
  });

  it('affiche le formulaire de réinitialisation après clic sur "Mot de passe oublié?"', () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByText(/mot de passe oublié \?/i));

    expect(screen.getByPlaceholderText(/entrez votre email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /réinitialiser le mot de passe/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retour à la connexion/i })).toBeInTheDocument();
  });

  it('retourne au formulaire de connexion après clic sur "Retour à la connexion"', () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByText(/mot de passe oublié \?/i));
    expect(screen.getByPlaceholderText(/entrez votre email/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /retour à la connexion/i }));
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

});
