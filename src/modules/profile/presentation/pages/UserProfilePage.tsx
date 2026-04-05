import type { UpdateUserProfileDTO } from '../../domain/userProfile.entity';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../application/useUserProfile';
import { useProfileForm } from '../hooks/useProfileForm';
import ProfileAvatar from '../components/ProfileAvatar';
import VisibilityToggles from '../components/VisibilityToggles';
import GeneralInfoForm from '../components/GeneralInfoForm';
import SocialLinksForm from '../components/SocialLinksForm';
import CircleButton from '../components/CircleButton';
import BotonInicio from '../../../../shared/components/BotonInicio';
import Sidebar from '../../../../shared/components/Sidebar';
import { PortlyLogoBig } from '../../../../shared/components/AppShell';


export function UserProfilePage() {
  const { profile, loading, saving, uploadAvatar, saveProfile } =
    useUserProfile();
  const { form, dirty, setField, setVisibility, setSocialLink } =
    useProfileForm(profile);
  const navigate = useNavigate();

  async function handleSave() {
    try {
      await saveProfile(form);
    } catch (error) {
      alert('No se pudo guardar el perfil.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-2 md:p-4 box-border flex items-center justify-center">
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
    <div className="h-screen bg-white p-2 md:p-4 box-border overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-[calc(100vh-2.5rem)] bg-[#0f111a] rounded-[2rem] flex flex-col shadow-2xl overflow-hidden">

        {/* Dos CircleButton dentro del BotonInicio, uno al lado del otro */}
        <BotonInicio>
          <div className="flex items-center gap-3">
            <CircleButton
              icon="G"
              ariaLabel="Acción G"
              onClick={() => {/* TODO: acción real */}}
            />
            <CircleButton
              icon="X"
              ariaLabel="Cerrar"
              onClick={() => {/* TODO: acción real */}}
            />
          </div>
        </BotonInicio>
        {/* Top Action Buttons */}
        <div className="absolute top-0 right-0 z-20">
          <div className="relative bg-white pt-4 pb-6 pl-8 pr-6 rounded-bl-[2.5rem]">
            {/* Curvas suavizadas */}
            <div className="absolute top-0 -left-6 w-6 h-6 bg-white overflow-hidden pointer-events-none">
              <div className="w-full h-full bg-[#0f111a] rounded-tr-[1.5rem]"></div>
            </div>
            <div className="absolute -bottom-6 right-0 w-6 h-6 bg-white overflow-hidden pointer-events-none">
              <div className="w-full h-full bg-[#0f111a] rounded-tr-[1.5rem]"></div>
            </div>

            <div className="bg-[#9fa2ff] flex items-center justify-center gap-4 px-6 py-2 rounded-full shadow-sm">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !dirty}
                className={`w-[42px] h-[42px] rounded-[14px] flex items-center justify-center transition-all stroke-[2.5px] ${
                  saving || !dirty
                    ? 'bg-[#1c1154]/40 cursor-not-allowed text-[#9fa2ff]/50'
                    : 'bg-[#1c1154] hover:bg-[#2b1b7a] active:scale-95 text-[#9fa2ff] cursor-pointer shadow-lg'
                }`}
                title="Guardar perfil"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-[#9fa2ff] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-[42px] h-[42px] rounded-[14px] bg-[#1c1154] hover:bg-[#2b1b7a] active:scale-95 flex items-center justify-center text-[#9fa2ff] transition-all cursor-pointer shadow-lg stroke-[2.5px]"
                title="Cerrar y volver al inicio"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 px-7 pt-5 pb-3 shrink-0">
          <PortlyLogoBig />
          <div>
            <h1 className="text-white text-2xl font-bold leading-tight">
              Ajustes de perfil
            </h1>
            <p className="text-[#6b7280] text-sm mt-0.5">
              Puedes modificar y editar algunos detalles en este apartado.
            </p>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 pb-5">
          <div className="border-r-2 border-gray-800">
            <Sidebar userName={fullName} avatarUrl={profile.avatarUrl} />
          </div>

          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-thin px-5">
            <div className="w-full flex items-center justify-center py-5">
              <div className="flex gap-12">
                <div className="w-[280px] flex flex-col gap-8 flex-shrink-0">
                  <ProfileAvatar
                    name={fullName}
                    profession={form.profession ?? profile.profession}
                    avatarUrl={profile.avatarUrl}
                    onFileChange={uploadAvatar}
                  />
                  <VisibilityToggles
                    visibility={{
                      showEmail:
                        form.visibility?.showEmail ??
                        profile.visibility.showEmail,
                      showProfession:
                        form.visibility?.showProfession ??
                        profile.visibility.showProfession,
                      showBio:
                        form.visibility?.showBio ?? profile.visibility.showBio,
                    }}
                    onChange={setVisibility}
                  />
                </div>

                <div className="flex flex-col gap-8 w-[583px]">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}