import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import SocialLinksForm from '../SocialLinksForm';

jest.mock('../../../../../infrastructure/storage/storage', () => ({
  getToken: () => 'token-test',
}));

describe('SocialLinksForm', () => {
  it('renderiza botones de vinculacion y campos de url', () => {
    const onChange = jest.fn();
    render(
      <SocialLinksForm
        links={{ instagram: '', facebook: '', youtube: '' }}
        connectedProviders={[]}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('button', { name: /Vincular GitHub/i })).toBeInTheDocument();
    expect(screen.getByLabelText('URL de Instagram')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('URL de Instagram'), { target: { value: 'https://ig.com/a' } });
    expect(onChange).toHaveBeenCalledWith('instagram', 'https://ig.com/a');
  });
});
