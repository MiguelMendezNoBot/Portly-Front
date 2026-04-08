import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ForgotPasswordForm } from '../ForgotPasswordForm';
import { forgotPassword } from '../../../infrastructure/authService';

const mockNavigate = jest.fn();

jest.mock('../../../infrastructure/authService', () => ({
  forgotPassword: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual =
    jest.requireActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra error cuando el correo esta vacio', async () => {
    render(
      <MemoryRouter>
        <ForgotPasswordForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Enviar enlace' }));
    expect(
      await screen.findByText('Por favor, ingresa tu correo electrónico.')
    ).toBeInTheDocument();
  });

  it('solicita recuperacion y navega al codigo', async () => {
    jest.mocked(forgotPassword).mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <ForgotPasswordForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('tu@ejemplo.com'), {
      target: { value: 'test@correo.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar enlace' }));

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith('test@correo.com');
      expect(mockNavigate).toHaveBeenCalledWith('/verify-code', {
        state: { email: 'test@correo.com' },
      });
    });
  });
});
