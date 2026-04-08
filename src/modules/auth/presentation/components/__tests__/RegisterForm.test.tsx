import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Dispatch, SetStateAction } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterForm } from '../RegisterForm';

const mockSetStep = jest.fn() as jest.MockedFunction<
  Dispatch<SetStateAction<number>>
>;
const mockValidate = jest.fn((step?: number) => {
  void step;
  return true;
});

jest.mock('../../../application/useRegisterForm', () => ({
  useRegisterForm: () => ({
    fields: {
      nombre: '',
      apellido: '',
      profesion: '',
      biografia: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    errors: {},
    toast: null,
    handleChange: () => jest.fn(),
    handleSubmit: jest.fn(),
    validate: mockValidate,
  }),
}));

describe('RegisterForm', () => {
  it('renderiza paso 1 y boton siguiente', () => {
    render(
      <MemoryRouter>
        <RegisterForm step={1} setStep={mockSetStep} />
      </MemoryRouter>
    );

    expect(screen.getByText('Crea tu cuenta')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Siguiente' })
    ).toBeInTheDocument();
  });

  it('avanza de paso cuando la validacion es correcta', () => {
    render(
      <MemoryRouter>
        <RegisterForm step={1} setStep={mockSetStep} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(mockValidate).toHaveBeenCalledWith(1);
    expect(mockSetStep).toHaveBeenCalled();
  });
});
