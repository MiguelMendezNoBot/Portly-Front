import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Toast } from '../Toast';

describe('Toast', () => {
  it('no renderiza cuando toast es null', () => {
    const { container } = render(<Toast toast={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza mensaje cuando hay toast', () => {
    render(<Toast toast={{ message: 'ok', type: 'success' }} />);
    expect(screen.getByText('ok')).toBeInTheDocument();
  });
});
