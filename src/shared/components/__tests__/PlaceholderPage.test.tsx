import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlaceholderPage from '../PlaceholderPage';

describe('PlaceholderPage', () => {
  it('renderiza titulo y texto de desarrollo', () => {
    render(
      <MemoryRouter>
        <PlaceholderPage title="Mi modulo" subtitle="Subtitulo" />
      </MemoryRouter>
    );
    expect(screen.getByText('Mi modulo')).toBeInTheDocument();
    expect(
      screen.getByText('Esta sección está en desarrollo.')
    ).toBeInTheDocument();
  });
});
