import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppShell from '../AppShell';

describe('AppShell', () => {
  it('renderiza titulo y contenido', () => {
    render(
      <MemoryRouter>
        <AppShell userName="Ana" pageTitle="Perfil">
          <p>contenido principal</p>
        </AppShell>
      </MemoryRouter>
    );

    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('contenido principal')).toBeInTheDocument();
  });
});
