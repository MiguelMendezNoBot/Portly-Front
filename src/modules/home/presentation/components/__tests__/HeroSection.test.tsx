import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../HeroSection';

describe('HeroSection', () => {
  it('renderiza título y CTA principal', () => {
    render(<HeroSection />);
    expect(screen.getByText('Construye tu legado,')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Comenzar ahora' })).toBeInTheDocument();
  });
});
