import type { UpdateUserProfileDTO } from '../../domain/userProfile.entity';
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
  const { profile, loading, uploadAvatar } = useUserProfile();
  const { form, setField, setVisibility, setSocialLink } = useProfileForm(profile);

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
          <div className="border-r-2 border-cyan-400">
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