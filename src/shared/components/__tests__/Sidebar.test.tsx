import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

describe('Sidebar', () => {
  it('renderiza nombre de usuario y enlaces', () => {
    render(
      <MemoryRouter>
        <Sidebar userName="Ana Perez" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Ana Perez')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });
});
