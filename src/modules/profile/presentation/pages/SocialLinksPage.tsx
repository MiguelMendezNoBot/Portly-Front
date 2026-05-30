import { useState } from 'react';
import { useUserProfile } from '../../application/useUserProfile';
import { useProfileForm } from '../hooks/useProfileForm';
import SocialLinksForm from '../components/SocialLinksForm';
import type { UserProfileEntity } from '../../domain/userProfile.entity';

type SocialKey = keyof UserProfileEntity['socialLinks'];

const DOMAIN_RULES: Partial<Record<SocialKey, { domains: string[]; label: string }>> = {
  instagram: { domains: ['instagram.com'], label: 'Instagram' },
  facebook:  { domains: ['facebook.com', 'fb.com'], label: 'Facebook' },
  youtube:   { domains: ['youtube.com', 'youtu.be'], label: 'YouTube' },
};

function validateSocialLinks(
  links: UserProfileEntity['socialLinks'] | undefined
): Partial<Record<SocialKey, string>> {
  const errors: Partial<Record<SocialKey, string>> = {};
  if (!links) return errors;

  for (const [key, value] of Object.entries(links) as [SocialKey, string | undefined][]) {
    const val = value?.trim();
    if (!val || val.startsWith('@')) continue;

    try {
      const { hostname } = new URL(val);
      const rule = DOMAIN_RULES[key];
      if (rule && !rule.domains.some((d) => hostname.includes(d))) {
        errors[key] = `Debe ser un enlace de ${rule.label} o iniciar con "@"`;
      }
    } catch {
      errors[key] = 'Debe ser una URL válida o iniciar con "@"';
    }
  }
  return errors;
}

export function SocialLinksPage() {
  const { profile, loading, saving, saveProfile } = useUserProfile();
  const { form, dirty, setSocialLink, reset } = useProfileForm(profile);
  const [socialErrors, setSocialErrors] = useState<Partial<Record<SocialKey, string>>>({});

  async function handleSave() {
    const errors = validateSocialLinks(form.socialLinks);
    if (Object.keys(errors).length > 0) {
      setSocialErrors(errors);
      return;
    }
    setSocialErrors({});
    try {
      await saveProfile(form);
    } catch {
      alert('No se pudo guardar los enlaces.');
    }
  }

  function handleCancel() {
    if (profile) reset(profile);
    setSocialErrors({});
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-src-7c6bec/30 border-t-src-7c6bec rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="py-6 max-w-lg flex flex-col gap-6">
      <SocialLinksForm
        links={form.socialLinks ?? profile.socialLinks}
        onChange={setSocialLink}
        errors={socialErrors}
      />

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={!dirty}
          className="px-5 py-2.5 rounded-[10px] text-sm font-medium text-src-6b7280 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-src-7c6bec hover:bg-src-6c5ce0 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
