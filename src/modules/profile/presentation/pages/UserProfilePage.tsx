import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  UserProfileEntity,
  UpdateUserProfileDTO,
} from '../../domain/userProfile.entity';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserProfile } from '../../application/useUserProfile';
import { useProfileForm } from '../hooks/useProfileForm';
import ProfileAvatar from '../components/ProfileAvatar';
import VisibilityToggles from '../components/VisibilityToggles';
import ProfilePreviewModal from '../components/ProfilePreviewModal';
import GeneralInfoForm from '../components/GeneralInfoForm';
import SocialLinksForm from '../components/SocialLinksForm';
import Sidebar from '../../../../shared/components/Sidebar';
import { PortlyLogoBig } from '../../../../shared/components/AppShell';
import BotonInicio from '../../../../shared/components/BotonInicio';
import {
  PORTLY_PENDING_OAUTH_PROVIDER_KEY,
  type PortlyOAuthLinkProvider,
} from '../constants/oauthLink.constants';
import { Toast } from '../../../../shared/components/Toast';

const LINKED_FLASH_MS = 4000;

function isPortlyOAuthProvider(p: string): p is PortlyOAuthLinkProvider {
  return p === 'github' || p === 'linkedin';
}

function SaveIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

interface PillContentProps {
  mode: 'normal' | 'linked';
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  dirty: boolean;
}

function PillContent({
  mode,
  onSave,
  onClose,
  saving,
  dirty,
}: PillContentProps) {
  if (mode === 'linked') {
    return (
      <div className="w-[240px] bg-emerald-500 rounded-full flex items-center gap-3 px-3 py-1.5 animate-fade-in">
        <div className="w-8 h-8 rounded-full bg-src-0f111a flex items-center justify-center text-emerald-400 shrink-0">
          <CheckIcon />
        </div>
        <span className="text-src-0f111a font-extrabold text-xs tracking-wide uppercase whitespace-nowrap">
          Vinculación correcta
        </span>
      </div>
    );
  }

  return (
    <div className="w-[240px] flex items-center justify-center gap-12">
      <button
        type="button"
        onClick={onSave}
        disabled={saving || !dirty}
        title="Guardar perfil"
        className={`w-[38px] h-[38px] rounded-[12px] flex items-center justify-center transition-all ${
          saving || !dirty
            ? 'bg-src-1c1154/40 cursor-not-allowed text-src-9fa2ff/50'
            : 'bg-src-1c1154 hover:bg-src-2b1b7a active:scale-95 text-src-9fa2ff cursor-pointer shadow-md'
        }`}
      >
        {saving ? (
          <div className="w-4 h-4 border-2 border-src-9fa2ff border-t-transparent rounded-full animate-spin" />
        ) : (
          <SaveIcon />
        )}
      </button>
      <button
        type="button"
        onClick={onClose}
        title="Cerrar"
        className="w-[38px] h-[38px] rounded-[12px] bg-src-1c1154 hover:bg-src-2b1b7a active:scale-95 flex items-center justify-center text-src-9fa2ff transition-all cursor-pointer shadow-md"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function PillContentMobile({
  mode,
  onSave,
  onClose,
  saving,
  dirty,
}: PillContentProps) {
  if (mode === 'linked') {
    return (
      <div className="bg-emerald-500 rounded-full flex items-center gap-2 px-4 py-1.5 animate-fade-in">
        <div className="w-7 h-7 rounded-full bg-src-0f111a flex items-center justify-center text-emerald-400 shrink-0">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <span className="text-src-0f111a font-extrabold text-[10px] tracking-wide uppercase whitespace-nowrap pr-1">
          Vinculación correcta
        </span>
      </div>
    );
  }

  return (
    <div className="bg-src-9fa2ff flex items-center gap-3 px-3 py-1.5 rounded-full shadow-lg">
      <button
        type="button"
        onClick={onSave}
        disabled={saving || !dirty}
        title="Guardar"
        className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-all ${
          saving || !dirty
            ? 'bg-src-1c1154/40 cursor-not-allowed text-src-9fa2ff/50'
            : 'bg-src-1c1154 hover:bg-src-2b1b7a active:scale-95 text-src-9fa2ff cursor-pointer shadow-lg'
        }`}
      >
        {saving ? (
          <div className="w-3.5 h-3.5 border-2 border-src-9fa2ff border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
        )}
      </button>
      <button
        type="button"
        onClick={onClose}
        title="Cerrar"
        className="w-8 h-8 rounded-[10px] bg-src-1c1154 hover:bg-src-2b1b7a active:scale-95 flex items-center justify-center text-src-9fa2ff transition-all cursor-pointer shadow-lg"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export function UserProfilePage() {
  const { profile, loading, saving, uploadAvatar, saveProfile } =
    useUserProfile();
  const { form, dirty, setField, patchVisibility, setSocialLink } =
    useProfileForm(profile);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pillMode, setPillMode] = useState<'normal' | 'linked'>('normal');
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [socialErrors, setSocialErrors] = useState<
    Partial<Record<keyof UserProfileEntity['socialLinks'], string>>
  >({});
  const pillTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevConnectedProvidersRef = useRef<string[]>([]);
  const providersBaselineReadyRef = useRef(false);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'already_linked') {
      setOauthError('Esta cuenta ya está vinculada a otro usuario.');
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
      setTimeout(() => setOauthError(null), 6000);
    } else if (error === 'access_denied') {
      setOauthError('Se canceló la vinculación.');
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
      setTimeout(() => setOauthError(null), 6000);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    return () => {
      if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
    };
  }, []);

  const triggerLinkedFlash = useCallback(() => {
    setPillMode('linked');
    if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
    pillTimerRef.current = setTimeout(
      () => setPillMode('normal'),
      LINKED_FLASH_MS
    );
  }, []);

  useEffect(() => {
    if (!profile) return;

    const currentProviders = profile.connectedProviders;
    const prevProviders = prevConnectedProvidersRef.current;

    if (!providersBaselineReadyRef.current) {
      providersBaselineReadyRef.current = true;
      const raw = sessionStorage.getItem(PORTLY_PENDING_OAUTH_PROVIDER_KEY);
      if (raw && isPortlyOAuthProvider(raw)) {
        sessionStorage.removeItem(PORTLY_PENDING_OAUTH_PROVIDER_KEY);
        if (currentProviders.includes(raw)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          triggerLinkedFlash();
        }
      }
      prevConnectedProvidersRef.current = currentProviders;
      return;
    }

    const prevSet = new Set(prevProviders);
    const newlyLinked = currentProviders.filter((p) => !prevSet.has(p));
    if (newlyLinked.some((p) => isPortlyOAuthProvider(p))) {
      triggerLinkedFlash();
    }

    prevConnectedProvidersRef.current = currentProviders;
  }, [profile, triggerLinkedFlash]);

  function validateSocialLinks(links: typeof form.socialLinks | undefined) {
    const errors: Partial<
      Record<keyof UserProfileEntity['socialLinks'], string>
    > = {};
    if (!links) return errors;

    for (const [key, value] of Object.entries(links)) {
      const val = value?.trim();
      if (!val) continue;

      // Allow strings starting with @ directly
      if (val.startsWith('@')) continue;

      try {
        const urlObj = new URL(val);
        const { hostname } = urlObj;

        // Verify specific domains for known platforms
        if (key === 'instagram' && !hostname.includes('instagram.com')) {
          errors[key] = 'Debe ser un enlace de Instagram o iniciar con "@"';
        } else if (
          key === 'facebook' &&
          !hostname.includes('facebook') &&
          !hostname.includes('fb.com')
        ) {
          errors[key] = 'Debe ser un enlace de Facebook o iniciar con "@"';
        } else if (
          key === 'youtube' &&
          !hostname.includes('youtube.com') &&
          !hostname.includes('youtu.be')
        ) {
          errors[key] = 'Debe ser un enlace de YouTube o iniciar con "@"';
        }
      } catch {
        errors[key as keyof UserProfileEntity['socialLinks']] =
          'Debe ser una URL válida o iniciar con "@"';
      }
    }
    return errors;
  }

  async function handleVisibilityToggle(
    key: keyof UserProfileEntity['visibility'],
    value: boolean
  ) {
    patchVisibility(key, value); // update UI without dirtying the form
    try {
      await saveProfile({
        firstName:  profile!.firstName,
        lastName:   profile!.lastName,
        profession: profile!.profession,
        bio:        profile!.bio,
        visibility: { ...(form.visibility as UserProfileEntity['visibility']), [key]: value },
      });
    } catch {
      patchVisibility(key, !value); // revert on failure, also without dirty
    }
  }

  async function handleSave() {
    const errors = validateSocialLinks(form.socialLinks);
    if (Object.keys(errors).length > 0) {
      setSocialErrors(errors);
      const socialBlock = document.getElementById('social-links-section');
      if (socialBlock)
        socialBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSocialErrors({});

    try {
      await saveProfile(form);
    } catch {
      alert('No se pudo guardar el perfil.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-2 md:p-4 box-border flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-src-7c6bec/30 border-t-src-7c6bec rounded-full animate-spin" />
          <p className="text-src-6b7280 text-sm">Cargando perfil…</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const pillProps: PillContentProps = {
    mode: pillMode,
    onSave: handleSave,
    onClose: () => navigate('/'),
    saving,
    dirty,
  };

  return (
    <div className="h-screen bg-white p-2 md:p-4 box-border overflow-hidden flex items-center justify-center">
      {oauthError && <Toast toast={{ message: oauthError, type: 'error' }} />}
      <div className="relative w-full h-[calc(100vh-2.5rem)] bg-[#0F131F] rounded-[2rem] flex flex-col shadow-2xl overflow-hidden">
        <div className="md:hidden absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-11 h-11 rounded-full bg-src-9fa2ff flex items-center justify-center text-src-1c1154 shadow-lg"
            aria-label="Abrir menú"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <PillContentMobile {...pillProps} />
        </div>

        <div className="hidden md:block">
          <BotonInicio>
            <PillContent {...pillProps} />
          </BotonInicio>
        </div>

        <div className="hidden md:flex items-center gap-5 px-7 pt-5 pb-3 shrink-0">
          <PortlyLogoBig />
          <div>
            <h1 className="text-white text-2xl font-bold leading-tight">
              Ajustes de perfil
            </h1>
            <p className="text-src-6b7280 text-sm mt-0.5">
              Puedes modificar y editar algunos detalles en este apartado.
            </p>
          </div>
        </div>

        <div className="md:hidden px-5 pt-16 pb-2 shrink-0">
          <h1 className="text-white text-lg font-bold leading-tight">
            Ajustes de perfil
          </h1>
          <p className="text-src-6b7280 text-xs mt-0.5">
            Puedes modificar y editar algunos detalles.
          </p>
        </div>

        <div className="flex flex-1 min-h-0 pb-5">
          <div className="hidden md:flex border-r-2 border-gray-800 shrink-0">
            <Sidebar userName={fullName} avatarUrl={profile.avatarUrl} />
          </div>
          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-thin px-5">
            <div className="w-full flex items-center justify-center py-5">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full max-w-4xl">
                <div className="w-full md:w-[280px] flex flex-col gap-8 md:flex-shrink-0">
                  <ProfileAvatar
                    name={fullName}
                    profession={form.profession ?? profile.profession}
                    avatarUrl={profile.avatarUrl}
                    onFileChange={uploadAvatar}
                    uploading={saving}
                  />
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
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="w-full py-2.5 rounded-[10px] bg-src-9fa2ff/10 hover:bg-src-9fa2ff/20 border border-src-9fa2ff/20 text-src-9fa2ff text-xs font-bold tracking-widest transition-all cursor-pointer"
                  >
                    Visualizar perfil
                  </button>
                </div>
                <div className="flex flex-col gap-8 w-full md:w-[583px]">
                  <GeneralInfoForm
                    form={form}
                    profile={profile}
                    onFieldChange={(key, value) =>
                      setField(key as keyof UpdateUserProfileDTO, value)
                    }
                  />
                  <div id="social-links-section">
                    <SocialLinksForm
                      links={form.socialLinks ?? profile.socialLinks}
                      connectedProviders={profile.connectedProviders}
                      onChange={setSocialLink}
                      errors={socialErrors}
                    />
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>

        {previewOpen && (
          <ProfilePreviewModal
            profile={profile}
            form={form}
            onClose={() => setPreviewOpen(false)}
          />
        )}

        {sidebarOpen && (
          <>
            <div
              className="md:hidden absolute inset-0 bg-black/60 z-30 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="md:hidden absolute top-0 left-0 h-full w-72 bg-[#0F131F] z-40 shadow-2xl flex flex-col rounded-r-[2rem] overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src="/portly_logo.png"
                    alt="Portly"
                    className="w-8 h-8"
                  />
                  <span className="text-white font-bold text-base tracking-wide">
                    Portly
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar userName={fullName} avatarUrl={profile.avatarUrl} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
