import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { NewPasswordForm } from '../NewPasswordForm';

const mockNavigate = jest.fn();

jest.mock('../../../../../shared/hooks/useToast', () => ({
  useToast: () => ({ toast: null, showToast: jest.fn() }),
}));

jest.mock('../../../infrastructure/authService', () => ({
  resetPassword: jest.fn(),
  loginUser: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { email: 'mail@test.com', codigo: '123456' } }),
  };
});

describe('NewPasswordForm', () => {
  it('renderiza formulario de nueva contraseña', () => {
    render(<NewPasswordForm />);
    expect(screen.getByText('Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cambiar contraseña/i })).toBeDisabled();
  });

  it('muestra error cuando las contraseñas no coinciden', () => {
    render(<NewPasswordForm />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'abcd1234' } });
    fireEvent.change(inputs[1], { target: { value: 'abcd1235' } });

    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
  });
});
