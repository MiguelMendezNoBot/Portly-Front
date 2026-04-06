import type { UpdateUserProfileDTO, UserProfileEntity } from '../domain/userProfile.entity';

export interface IUserProfileRepository {
  getProfile(): Promise<UserProfileEntity>;
  updateProfile(dto: UpdateUserProfileDTO): Promise<UserProfileEntity>;
  updateAvatar(file: File): Promise<{ avatarUrl: string }>;
}
