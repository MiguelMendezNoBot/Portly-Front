import { describe, expect, it } from '@jest/globals';
import type { UserProfileEntity } from '../userProfile.entity';
import { applyProfileUpdate } from '../userProfile.rules';

const base = (): UserProfileEntity => ({
  id: '1',
  firstName: 'A',
  lastName: 'B',
  email: 'a@b.c',
  profession: 'P',
  bio: 'Bio',
  visibility: { showEmail: true, showProfession: false, showBio: true },
  socialLinks: { github: 'g', linkedin: '' },
  connectedProviders: [],
});

describe('applyProfileUpdate', () => {
  it('fusiona campos y objetos anidados parcialmente', () => {
    const next = applyProfileUpdate(base(), {
      firstName: 'Ana',
      visibility: { showProfession: true },
      socialLinks: { linkedin: 'https://li' },
    });

    expect(next.firstName).toBe('Ana');
    expect(next.lastName).toBe('B');
    expect(next.visibility.showProfession).toBe(true);
    expect(next.visibility.showEmail).toBe(true);
    expect(next.socialLinks.github).toBe('g');
    expect(next.socialLinks.linkedin).toBe('https://li');
  });
});
