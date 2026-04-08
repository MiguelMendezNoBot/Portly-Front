import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import ProfileAvatar from '../ProfileAvatar';

describe('ProfileAvatar', () => {
  it('muestra nombre y profesion', () => {
    render(
      <ProfileAvatar
        name="Ana"
        profession="Frontend"
        onFileChange={jest.fn()}
      />
    );
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  it('dispara onFileChange con archivo valido', () => {
    const onFileChange = jest.fn();
    render(
      <ProfileAvatar
        name="Ana"
        profession="Frontend"
        onFileChange={onFileChange}
      />
    );
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['a'], 'avatar.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(onFileChange).toHaveBeenCalled();
  });
});
