import { useUserProfile } from '../../application/useUserProfile';
import { useProfileForm } from '../hooks/useProfileForm';
import VisibilityToggles from '../components/VisibilityToggles';
import type { UserProfileEntity } from '../../domain/userProfile.entity';

export function VisibilityPage() {
  const { profile, saving, saveProfile } = useUserProfile();
  const { form, patchVisibility } = useProfileForm(profile);

  async function handleVisibilityToggle(
    key: keyof UserProfileEntity['visibility'],
    value: boolean
  ) {
    patchVisibility(key, value);
    try {
      await saveProfile({
        firstName:  profile!.firstName,
        lastName:   profile!.lastName,
        profession: profile!.profession,
        bio:        profile!.bio,
        visibility: { ...(form.visibility as UserProfileEntity['visibility']), [key]: value },
      });
    } catch {
      patchVisibility(key, !value);
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-src-7c6bec/30 border-t-src-7c6bec rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-6 max-w-lg">
      <div className="mb-6">
        <h2 className="text-white text-xl font-bold">Visibilidad rápida</h2>
        <p className="text-src-6b7280 text-sm mt-1">
          Controla qué información es visible en tu perfil público.
        </p>
      </div>

      <VisibilityToggles
        visibility={{
          showEmail:      form.visibility?.showEmail      ?? profile.visibility.showEmail,
          showProfession: form.visibility?.showProfession ?? profile.visibility.showProfession,
          showBio:        form.visibility?.showBio        ?? profile.visibility.showBio,
          showInstagram:  form.visibility?.showInstagram  ?? profile.visibility.showInstagram,
          showFacebook:   form.visibility?.showFacebook   ?? profile.visibility.showFacebook,
          showYoutube:    form.visibility?.showYoutube    ?? profile.visibility.showYoutube,
          showTechSkills: form.visibility?.showTechSkills ?? profile.visibility.showTechSkills,
          showSoftSkills: form.visibility?.showSoftSkills ?? profile.visibility.showSoftSkills,
          showExperience: form.visibility?.showExperience ?? profile.visibility.showExperience,
          showEducation:  form.visibility?.showEducation  ?? profile.visibility.showEducation,
        }}
        onChange={handleVisibilityToggle}
      />

      {saving && (
        <p className="text-src-6b7280 text-xs mt-4 text-center animate-pulse">
          Guardando…
        </p>
      )}
    </div>
  );
}
