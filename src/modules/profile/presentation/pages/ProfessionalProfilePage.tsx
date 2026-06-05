import { useUserProfile } from '../../application/useUserProfile';
import { useProfileForm } from '../hooks/useProfileForm';
import ProfessionalIdentitySection from '../components/ProfessionalIdentitySection';
import ProfessionalProfilesSection from '../components/ProfessionalProfilesSection';

export function ProfessionalProfilePage() {
  const { profile, loading, saving, saveProfile } = useUserProfile();
  const { form, dirty, setField, reset } = useProfileForm(profile);

  async function handleSave() {
    try {
      await saveProfile(form);
    } catch {
      alert('No se pudo guardar el perfil profesional.');
    }
  }

  function handleCancel() {
    if (profile) reset(profile);
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
    <div className="max-w-5xl mx-auto pb-20 flex flex-col gap-4">
      <ProfessionalIdentitySection form={form} onFieldChange={setField} />

      <div className="flex items-center justify-end gap-3 px-6">
        <button
          type="button"
          onClick={handleCancel}
          disabled={!dirty}
          className="py-2.5 px-5 rounded-full text-sm font-semibold text-[#9ca3af] hover:text-white border border-white/10 hover:border-white/20 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
          className="flex items-center gap-2 bg-gradient-to-r from-[#bdbefe] to-[#a092ec] hover:brightness-110 text-[#0D0096] py-2.5 px-5 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && (
            <div className="w-4 h-4 border-2 border-[#0D0096]/30 border-t-[#0D0096] rounded-full animate-spin" />
          )}
          Guardar cambios
        </button>
      </div>

      <ProfessionalProfilesSection />
    </div>
  );
}
