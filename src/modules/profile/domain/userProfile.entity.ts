export interface UserProfileEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  bio: string;
  phone?: string;
  phoneCode?: string;
  nationality?: string;
  avatarUrl?: string;
  visibility: {
    showEmail: boolean;
    showProfession: boolean;
    showBio: boolean;
    showPhone?: boolean;
    showNationality?: boolean;
    showLinkedin?: boolean;
    showGithub?: boolean;
    showInstagram: boolean;
    showFacebook: boolean;
    showYoutube: boolean;
    showTechSkills: boolean;
    showSoftSkills: boolean;
    showExperience: boolean;
    showEducation: boolean;
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
  phone?: string;
  phoneCode?: string;
  nationality?: string;
  visibility?: Partial<UserProfileEntity['visibility']>;
  socialLinks?: Partial<UserProfileEntity['socialLinks']>;
}
