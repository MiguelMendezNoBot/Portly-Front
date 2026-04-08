import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '../LoginForm';

const mockHandleSubmit = jest.fn();
const mockHandleChange = jest.fn(() => jest.fn());

jest.mock('../../../application/useLoginForm', () => ({
  useLoginForm: () => ({
    fields: { email: 'user@test.com', password: '123456' },
    errors: {},
    toast: null,
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
  }),
}));

describe('LoginForm', () => {
  it('renderiza contenido base', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Iniciar Sesion' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '¿Olvidaste tu contraseña?' })
    ).toBeInTheDocument();
  });

  it('envia el formulario con submit', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.submit(
      screen.getByRole('button', { name: 'Iniciar Sesion' }).closest('form')!
    );
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
