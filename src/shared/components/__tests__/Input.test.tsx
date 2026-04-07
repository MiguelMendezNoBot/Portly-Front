import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('renderiza input de texto y permite escribir', () => {
    const onChange = jest.fn();
    render(<Input label="Correo" value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('renderiza select cuando select es true', () => {
    render(<Input label="Profesion" select options={['Dev']} value="" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
