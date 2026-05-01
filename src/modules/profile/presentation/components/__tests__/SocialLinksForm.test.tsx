import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import SocialLinksForm from '../SocialLinksForm';

describe('SocialLinksForm', () => {
  it('renderiza campos de url de redes sociales', () => {
    const onChange = jest.fn();
    render(
      <SocialLinksForm
        links={{ instagram: '', facebook: '', youtube: '' }}
        onChange={onChange}
      />
    );
    expect(screen.getByLabelText('URL de Instagram')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('URL de Instagram'), {
      target: { value: 'https://ig.com/a' },
    });
    expect(onChange).toHaveBeenCalledWith('instagram', 'https://ig.com/a');
  });
});
