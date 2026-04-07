import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import CircleButton from '../CircleButton';

describe('CircleButton', () => {
  it('renderiza icono y ejecuta click', () => {
    const onClick = jest.fn();
    render(<CircleButton icon={<span>+</span>} onClick={onClick} ariaLabel="agregar" />);
    fireEvent.click(screen.getByRole('button', { name: 'agregar' }));
    expect(onClick).toHaveBeenCalled();
  });
});
