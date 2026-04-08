import { useEffect, useState } from 'react';
import type {
  UserProfileEntity,
  UpdateUserProfileDTO,
} from '../../domain/userProfile.entity';

export function useProfileForm(profile: UserProfileEntity | null) {
  const [form, setForm] = useState<UpdateUserProfileDTO>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      profession: profile.profession,
      bio: profile.bio,
      visibility: { ...profile.visibility },
      socialLinks: { ...profile.socialLinks },
    });
    setDirty(false);
  }, [profile]);

  function setField<K extends keyof UpdateUserProfileDTO>(
    key: K,
    value: UpdateUserProfileDTO[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function setVisibility(
    key: keyof UserProfileEntity['visibility'],
    value: boolean
  ) {
    setForm((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, [key]: value },
    }));
    setDirty(true);
  }

  function setSocialLink(
    key: keyof UserProfileEntity['socialLinks'],
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));
    setDirty(true);
  }

  function reset(p: UserProfileEntity) {
    setForm({
      firstName: p.firstName,
      lastName: p.lastName,
      profession: p.profession,
      bio: p.bio,
      visibility: { ...p.visibility },
      socialLinks: { ...p.socialLinks },
    });
    setDirty(false);
  }

  return { form, dirty, setField, setVisibility, setSocialLink, reset };
}
