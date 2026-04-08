import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BotonInicio from '../BotonInicio';

describe('BotonInicio', () => {
  it('renderiza boton con texto por defecto', () => {
    render(
      <MemoryRouter>
        <BotonInicio />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('link', { name: 'EXPLORAR COMO INVITADO' })
    ).toBeInTheDocument();
  });
});
