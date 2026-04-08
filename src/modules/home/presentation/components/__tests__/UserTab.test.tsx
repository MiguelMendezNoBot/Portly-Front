import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserTab } from '../UserTab';

const mockLogout = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('UserTab', () => {
  it('muestra boton de login cuando no hay usuario', () => {
    mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
    render(
      <MemoryRouter>
        <UserTab />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('link', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
  });

  it('permite cerrar sesion cuando hay usuario', () => {
    mockUseAuth.mockReturnValue({
      user: { displayName: 'ANA PEREZ', email: 'ana@test.com' },
      logout: mockLogout,
    });
    render(
      <MemoryRouter>
        <UserTab />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /CERRAR/i }));
    expect(mockLogout).toHaveBeenCalled();
  });
});
