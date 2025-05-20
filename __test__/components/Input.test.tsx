// __tests__/components/Input.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '@/components/Input';

describe('Input component', () => {
  it('affiche le label si fourni', () => {
    render(<Input name="email" placeholder="Entrez votre email" label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();  });

  // autres tests...
  it('n\'affiche pas le label si non fourni', () => {
    render(<Input name="email" placeholder="Entrez votre email" />);
    expect(screen.queryByText('Email')).not.toBeInTheDocument();
  });
  it('affiche le placeholder', () => {  
    render(<Input name="email" placeholder="Entrez votre email" />);
    expect(screen.getByPlaceholderText('Entrez votre email')).toBeInTheDocument();
  }
  );
  it('a le bon type', () => {
    render(<Input name="email" type="email" placeholder="Entrez votre email" />);
    expect(screen.getByPlaceholderText('Entrez votre email')).toHaveAttribute('type', 'email');
  }
  );
  it('a le bon nom', () => {
    render(<Input name="email" placeholder="Entrez votre email" />);
    expect(screen.getByPlaceholderText('Entrez votre email')).toHaveAttribute('name', 'email');
  }
  );
  it('est requis si le prop required est vrai', () => {
    render(<Input name="email" placeholder="Entrez votre email" required />);
    expect(screen.getByPlaceholderText('Entrez votre email')).toBeRequired();
  }
  );
  it('n\'est pas requis si le prop required est faux', () => {
    render(<Input name="email" placeholder="Entrez votre email" required={false} />);
    expect(screen.getByPlaceholderText('Entrez votre email')).not.toBeRequired();
  }
  );
  
});
