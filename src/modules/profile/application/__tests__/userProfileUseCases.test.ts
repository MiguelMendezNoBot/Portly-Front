import { describe, expect, it, jest } from '@jest/globals';
import type { UserProfileEntity } from '../../domain/userProfile.entity';
import type { IUserProfileRepository } from '../IUserProfileRepository';
import { loadUserProfile, saveUserProfile, uploadUserAvatar } from '../userProfileUseCases';

const sampleProfile = (): UserProfileEntity => ({
  id: '1',
  firstName: 'A',
  lastName: 'B',
  email: 'a@b.c',
  profession: 'P',
  bio: '',
  visibility: { showEmail: true, showProfession: true, showBio: true },
  socialLinks: {},
  connectedProviders: [],
});

describe('userProfile use cases (orquestación con dobles)', () => {
  it('loadUserProfile delega en getProfile', async () => {
    const p = sampleProfile();
    const getProfile = jest.fn<IUserProfileRepository['getProfile']>().mockResolvedValue(p);
    const repo: IUserProfileRepository = {
      getProfile,
      updateProfile: jest.fn(),
      updateAvatar: jest.fn(),
    };

    await expect(loadUserProfile(repo)).resolves.toEqual(p);
    expect(getProfile).toHaveBeenCalledTimes(1);
  });

  it('saveUserProfile delega el DTO al repositorio', async () => {
    const updated = sampleProfile();
    updated.firstName = 'Z';
    const updateProfile = jest.fn<IUserProfileRepository['updateProfile']>().mockResolvedValue(updated);
    const repo: IUserProfileRepository = {
      getProfile: jest.fn(),
      updateProfile,
      updateAvatar: jest.fn(),
    };

    const dto = { firstName: 'Z' as const };
    await expect(saveUserProfile(repo, dto)).resolves.toEqual(updated);
    expect(updateProfile).toHaveBeenCalledWith(dto);
  });

  it('uploadUserAvatar pasa el archivo', async () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    const updateAvatar = jest
      .fn<IUserProfileRepository['updateAvatar']>()
      .mockResolvedValue({ avatarUrl: 'https://cdn/a.png' });
    const repo: IUserProfileRepository = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
      updateAvatar,
    };

    await uploadUserAvatar(repo, file);
    expect(updateAvatar).toHaveBeenCalledWith(file);
  });
});
