import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { HeroMockup } from '../HeroMockup';

describe('HeroMockup', () => {
  it('renderiza la insignia Auto-Responsive', () => {
    render(<HeroMockup />);
    expect(screen.getByText('Auto-Responsive')).toBeInTheDocument();
  });
});
