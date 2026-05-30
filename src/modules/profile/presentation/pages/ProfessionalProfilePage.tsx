import { useUserProfile } from '../../application/useUserProfile';
import { useProfileForm } from '../hooks/useProfileForm';
import ProfessionalIdentitySection from '../components/ProfessionalIdentitySection';

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
    <div className="py-6 max-w-lg flex flex-col gap-6">
      <ProfessionalIdentitySection form={form} onFieldChange={setField} />

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
          {saving && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
