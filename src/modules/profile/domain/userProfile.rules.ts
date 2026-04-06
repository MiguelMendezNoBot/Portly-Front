import type { UpdateUserProfileDTO, UserProfileEntity } from './userProfile.entity';

/** Aplica un parche sobre una entidad de perfil (reglas puras, sin I/O). */
export function applyProfileUpdate(
  current: UserProfileEntity,
  dto: UpdateUserProfileDTO,
): UserProfileEntity {
  return {
    ...current,
    firstName: dto.firstName ?? current.firstName,
    lastName: dto.lastName ?? current.lastName,
    profession: dto.profession ?? current.profession,
    bio: dto.bio ?? current.bio,
    visibility: {
      ...current.visibility,
      ...(dto.visibility ?? {}),
    },
    socialLinks: {
      ...current.socialLinks,
      ...(dto.socialLinks ?? {}),
    },
  };
}
