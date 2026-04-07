export interface UserProfileEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  bio: string;
  avatarUrl?: string;
  visibility: {
    showEmail: boolean;
    showProfession: boolean;
    showBio: boolean;
  };
  socialLinks: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  connectedProviders: string[];
}

export interface UpdateUserProfileDTO {
  firstName?: string;
  lastName?: string;
  profession?: string;
  bio?: string;
  visibility?: Partial<UserProfileEntity['visibility']>;
  socialLinks?: Partial<UserProfileEntity['socialLinks']>;
}
