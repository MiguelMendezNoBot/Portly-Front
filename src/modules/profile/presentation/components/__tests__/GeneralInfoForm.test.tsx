import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import type { UserProfileEntity } from '../../../domain/userProfile.entity';
import GeneralInfoForm from '../GeneralInfoForm';

const baseProfile: UserProfileEntity = {
  id: '1',
  firstName: 'Ana',
  lastName: 'Perez',
  email: 'ana@test.com',
  profession: 'Dev',
  bio: 'Hola',
  visibility: { showEmail: true, showProfession: true, showBio: true },
  socialLinks: {},
  connectedProviders: [],
};

describe('GeneralInfoForm', () => {
  it('muestra datos base y propaga cambios', () => {
    const onFieldChange = jest.fn();
    render(
      <GeneralInfoForm
        form={{ firstName: 'Ana', lastName: 'Perez', profession: 'Dev', bio: 'Hola' }}
        profile={baseProfile}
        onFieldChange={onFieldChange}
      />,
    );

    fireEvent.change(screen.getByDisplayValue('Ana'), { target: { value: 'Anita' } });
    expect(onFieldChange).toHaveBeenCalledWith('firstName', 'Anita');
    expect(screen.getByDisplayValue('ana@test.com')).toBeDisabled();
  });
});
