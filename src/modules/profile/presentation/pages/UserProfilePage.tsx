import AppShell from '../../../../shared/components/AppShell';
import { useUserProfile } from '../../application/useUserProfile';
import { useProfileForm } from '../hooks/useProfileForm';
import ProfileAvatar from '../components/ProfileAvatar';
import VisibilityToggles from '../components/VisibilityToggles';
import GeneralInfoForm from '../components/GeneralInfoForm';
import SocialLinksForm from '../components/SocialLinksForm';
import type { UpdateUserProfileDTO } from '../../domain/userProfile.entity';

// ── Íconos ────────────────────────────────────────────────────────────────────
function SaveIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Píldora con botones guardar / descartar ───────────────────────────────────
interface ActionPillProps {
  onSave: () => void;
  onDiscard: () => void;
  saving: boolean;
  dirty: boolean;
}

function ActionPill({ onSave, onDiscard, saving, dirty }: ActionPillProps) {
  return (
    /*
     * Píldora violeta claro que contiene los dos botones circulares.
     * Coincide visualmente con el "tab" / muesca del polígono.
     */
    <div className="flex items-center gap-2 bg-[#c4bef8]/25 border border-[#7c6bec]/40 rounded-full px-2 py-2 backdrop-blur-sm">
      {/* Botón guardar */}
      <button
        type="button"
        onClick={onSave}
        disabled={saving || !dirty}
        title="Guardar cambios"
        className="
          w-10 h-10 rounded-full
          bg-[#7c6bec]/30 border border-[#7c6bec]/60
          flex items-center justify-center text-[#c4bef8]
          hover:bg-[#7c6bec]/55 active:scale-95
          transition-all duration-150
          disabled:opacity-35 disabled:cursor-not-allowed
        "
      >
        {saving ? (
          <div className="w-4 h-4 border-2 border-[#c4bef8]/30 border-t-[#c4bef8] rounded-full animate-spin" />
        ) : (
          <SaveIcon />
        )}
      </button>

      {/* Botón descartar */}
      <button
        type="button"
        onClick={onDiscard}
        title="Descartar cambios"
        className="
          w-10 h-10 rounded-full
          bg-[#7c6bec]/30 border border-[#7c6bec]/60
          flex items-center justify-center text-[#c4bef8]
          hover:bg-[#7c6bec]/55 active:scale-95
          transition-all duration-150
        "
      >
        <CloseIcon />
      </button>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
export function UserProfilePage() {
  const { profile, loading, saving, saveProfile, uploadAvatar } = useUserProfile();
  const { form, dirty, setField, setVisibility, setSocialLink, reset } = useProfileForm(profile);

  async function handleSave() {
    if (!profile) return;
    await saveProfile(form);
  }

  function handleDiscard() {
    if (profile) reset(profile);
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#e2e2e8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#7c6bec]/30 border-t-[#7c6bec] rounded-full animate-spin" />
          <p className="text-[#6b7280] text-sm">Cargando perfil…</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <AppShell
      userName={fullName}
      avatarUrl={profile.avatarUrl}
      pageTitle="Ajustes de perfil"
      pageSubtitle="Puedes modificar y editar algunos detalles en este apartado."
      topRightSlot={
        <ActionPill
          onSave={handleSave}
          onDiscard={handleDiscard}
          saving={saving}
          dirty={dirty}
        />
      }
    >
      {/* Grid de 2 columnas: izquierda fija 290px, derecha flexible */}
      <div className="grid grid-cols-[290px_1fr] gap-12 p-1">

        {/* ── Columna izquierda ── */}
        <div className="flex flex-col gap-4">
          <ProfileAvatar
            name={fullName}
            profession={form.profession ?? profile.profession}
            avatarUrl={profile.avatarUrl}
            onFileChange={uploadAvatar}
          />
          <VisibilityToggles
            visibility={{
              showEmail:      form.visibility?.showEmail      ?? profile.visibility.showEmail,
              showProfession: form.visibility?.showProfession ?? profile.visibility.showProfession,
              showBio:        form.visibility?.showBio        ?? profile.visibility.showBio,
            }}
            onChange={setVisibility}
          />
        </div>

        {/* ── Columna derecha ── */}
        <div className="flex flex-col gap-4">
          <GeneralInfoForm
            form={form}
            profile={profile}
            onFieldChange={(key, value) =>
              setField(key as keyof UpdateUserProfileDTO, value)
            }
          />
          <SocialLinksForm
            links={form.socialLinks ?? profile.socialLinks}
            connectedProviders={profile.connectedProviders}
            onChange={setSocialLink}
          />
        </div>
      </div>
    </AppShell>
  );
}
