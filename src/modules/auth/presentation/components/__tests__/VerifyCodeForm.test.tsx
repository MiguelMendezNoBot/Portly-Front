import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { VerifyCodeForm } from '../VerifyCodeForm';
import { verifyCode } from '../../../infrastructure/authService';

const mockNavigate = jest.fn();

jest.mock('../../../infrastructure/authService', () => ({
  verifyCode: jest.fn(),
  forgotPassword: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual =
    jest.requireActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { email: 'user@test.com' } }),
  };
});

describe('VerifyCodeForm', () => {
  it('muestra error con codigo incompleto', async () => {
    render(<VerifyCodeForm />);
    fireEvent.click(screen.getByRole('button', { name: 'VERIFICAR' }));
    expect(
      await screen.findByText('Por favor, ingresa el código de 6 dígitos.')
    ).toBeInTheDocument();
  });

  it('verifica codigo correcto y navega', async () => {
    jest.mocked(verifyCode).mockResolvedValueOnce(undefined);
    render(<VerifyCodeForm />);

    const inputs = screen.getAllByRole('textbox');
    ['1', '2', '3', '4', '5', '6'].forEach((value, idx) => {
      fireEvent.change(inputs[idx], { target: { value } });
    });

    fireEvent.click(screen.getByRole('button', { name: 'VERIFICAR' }));

    await waitFor(() => {
      expect(verifyCode).toHaveBeenCalledWith('user@test.com', '123456');
      expect(mockNavigate).toHaveBeenCalledWith('/reset-password', {
        state: { email: 'user@test.com', codigo: '123456' },
      });
    });
  });
});
