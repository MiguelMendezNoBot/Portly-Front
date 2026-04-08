import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import VisibilityToggles from '../VisibilityToggles';

describe('VisibilityToggles', () => {
  it('renderiza opciones y propaga cambios', () => {
    const onChange = jest.fn();
    render(
      <VisibilityToggles
        visibility={{ showEmail: true, showProfession: false, showBio: true }}
        onChange={onChange}
      />
    );

    const toggles = screen.getAllByRole('switch');
    fireEvent.click(toggles[1]);
    expect(onChange).toHaveBeenCalledWith('showProfession', true);
  });
});
