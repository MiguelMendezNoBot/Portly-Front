import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('renderiza logo y links de navegacion', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('PORTLY')).toBeInTheDocument();
    expect(screen.getByText('PRINCIPAL')).toBeInTheDocument();
  });
});
