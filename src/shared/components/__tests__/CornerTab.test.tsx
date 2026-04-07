import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import CornerTab from '../CornerTab';

describe('CornerTab', () => {
  it('renderiza texto por defecto', () => {
    render(<CornerTab />);
    expect(screen.getByText('cuadro de animacion')).toBeInTheDocument();
  });
});
