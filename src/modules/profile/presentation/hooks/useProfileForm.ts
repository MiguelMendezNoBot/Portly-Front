import { useEffect, useRef, useState } from 'react';
import type {
  UserProfileEntity,
  UpdateUserProfileDTO,
} from '../../domain/userProfile.entity';

function fullVisibility(v: UserProfileEntity['visibility']) {
  return {
    showEmail:      v.showEmail      ?? true,
    showProfession: v.showProfession ?? true,
    showBio:        v.showBio        ?? true,
    showInstagram:  v.showInstagram  ?? true,
    showFacebook:   v.showFacebook   ?? true,
    showYoutube:    v.showYoutube    ?? true,
    showTechSkills: v.showTechSkills ?? true,
    showSoftSkills: v.showSoftSkills ?? true,
    showExperience: v.showExperience ?? true,
    showEducation:  v.showEducation  ?? true,
  };
}

export function useProfileForm(profile: UserProfileEntity | null) {
  const [form, setForm] = useState<UpdateUserProfileDTO>({});
  const [dirty, setDirty] = useState(false);

  // Ref so the profile-change effect can read dirty without a stale closure
  const dirtyRef = useRef(false);
  useEffect(() => { dirtyRef.current = dirty; });

  // Only reset the form when profile changes AND the user has no unsaved edits.
  // This prevents auto-saved visibility toggles from wiping dirty name/bio fields.
  useEffect(() => {
    if (!profile || dirtyRef.current) return;
    setForm({
      firstName:   profile.firstName,
      lastName:    profile.lastName,
      profession:  profile.profession,
      bio:         profile.bio,
      phone:       profile.phone ?? '',
      phoneCode:   profile.phoneCode ?? '+591',
      nationality: profile.nationality ?? '',
      visibility:  fullVisibility(profile.visibility),
      socialLinks: { ...profile.socialLinks },
    });
    setDirty(false);
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Updates visibility in form state without marking dirty (used for auto-save)
  function patchVisibility(
    key: keyof UserProfileEntity['visibility'],
    value: boolean
  ) {
    setForm((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, [key]: value },
    }));
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
      firstName:   p.firstName,
      lastName:    p.lastName,
      profession:  p.profession,
      bio:         p.bio,
      phone:       p.phone ?? '',
      phoneCode:   p.phoneCode ?? '+591',
      nationality: p.nationality ?? '',
      visibility:  fullVisibility(p.visibility),
      socialLinks: { ...p.socialLinks },
    });
    setDirty(false);
  }

  return { form, dirty, setField, setVisibility, patchVisibility, setSocialLink, reset };
}
