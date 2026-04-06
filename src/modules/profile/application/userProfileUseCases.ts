import type { UpdateUserProfileDTO, UserProfileEntity } from '../domain/userProfile.entity';
import type { IUserProfileRepository } from './IUserProfileRepository';

export async function loadUserProfile(repo: IUserProfileRepository): Promise<UserProfileEntity> {
  return repo.getProfile();
}

export async function saveUserProfile(
  repo: IUserProfileRepository,
  dto: UpdateUserProfileDTO,
): Promise<UserProfileEntity> {
  return repo.updateProfile(dto);
}

export async function uploadUserAvatar(
  repo: IUserProfileRepository,
  file: File,
): Promise<{ avatarUrl: string }> {
  return repo.updateAvatar(file);
}
