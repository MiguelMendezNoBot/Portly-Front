import { useEffect, useState } from 'react';
import { httpClient } from '../../../../infrastructure/http/httpClient';
import type { UserProfileEntity, UpdateUserProfileDTO } from '../../domain/userProfile.entity';

interface Skill      { id: string; name: string; level: string; }
interface SoftSkill  { id: number; nombreHabilidad: string; }
interface Experience { id?: number; nombreEmpresa: string; cargo: string; fechaInicio: string; fechaFin: string | null; actualmenteTrabajando: boolean; descripcion: string; }
interface Formacion  { idFormacionAcademica?: number; institucion: string; carrera: string; nivel: string; fechaInicio: string; fechaFinalizacion: string | null; actualmenteEstudiando: boolean; }

interface Props {
  profile: UserProfileEntity;
  form: Partial<UpdateUserProfileDTO> & { visibility?: Partial<UserProfileEntity['visibility']> };
  onClose: () => void;
}

const LEVEL_COLOR: Record<string, string> = {
  Maestro:    'text-purple-400',
  Experto:    'text-blue-400',
  Avanzado:   'text-teal-400',
  Intermedio: 'text-yellow-400',
  Básico:     'text-slate-400',
};

function fmt(dateStr?: string | null) {
  if (!dateStr) return '';
  const [y, m] = dateStr.split('-');
  return `${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][+m - 1]} ${y}`;
}

function YTIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5v-7l6.25 3.5-6.25 3.5z"/></svg>; }
function FBIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>; }
function IGIcon()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>; }

export default function ProfilePreviewModal({ profile, form, onClose }: Props) {
  const [skills,     setSkills]     = useState<Skill[]>([]);
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education,  setEducation]  = useState<Formacion[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      httpClient.getAuth<Skill[]>('/api/skills').catch(() => [] as Skill[]),
      httpClient.getAuth<SoftSkill[]>('/api/soft-skills').catch(() => [] as SoftSkill[]),
      httpClient.getAuth<Experience[]>('/api/profile/experiencia').catch(() => [] as Experience[]),
      httpClient.getAuth<Formacion[]>('/api/profile/formacion').catch(() => [] as Formacion[]),
    ]).then(([sk, soft, exp, edu]) => {
      setSkills(sk);
      setSoftSkills(soft);
      setExperience(exp);
      setEducation(edu);
    }).finally(() => setLoading(false));
  }, []);

  const v = {
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
  };

  const nombre    = form.firstName ?? profile.firstName;
  const apellido  = form.lastName  ?? profile.lastName;
  const profesion = form.profession ?? profile.profession;
  const bio       = form.bio        ?? profile.bio;
  const links     = { ...profile.socialLinks, ...form.socialLinks };
  const initials  = `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase();

  const hasSocials = (v.showYoutube && links.youtube) || (v.showFacebook && links.facebook) || (v.showInstagram && links.instagram);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[92vh] bg-[#0d1120] rounded-[1.5rem] shadow-2xl flex flex-col overflow-hidden">

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-8 pt-8 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-src-7c6bec/30 border-t-src-7c6bec rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-7">

              {/* ── Profile header ── */}
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-src-1c1154 flex items-center justify-center ring-2 ring-white/10 shrink-0">
                  {profile.avatarUrl
                    ? <img src={profile.avatarUrl} alt={nombre} className="w-full h-full object-cover" />
                    : <span className="text-src-9fa2ff text-xl font-bold">{initials}</span>}
                </div>

                {/* Text + socials */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-white text-2xl font-extrabold leading-tight">
                        {nombre} {apellido}
                      </h2>
                      {v.showEmail && profile.email && (
                        <p className="text-src-9fa2ff text-sm mt-0.5">{profile.email}</p>
                      )}
                      {v.showProfession && profesion && (
                        <p className="text-src-9fa2ff text-sm mt-0.5">{profesion}</p>
                      )}
                    </div>

                    {/* Social icons */}
                    {hasSocials && (
                      <div className="flex items-center gap-2 shrink-0">
                        {v.showYoutube && links.youtube && (
                          <a href={links.youtube} target="_blank" rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-[#171B28] border border-white/10 flex items-center justify-center text-src-a7aab9 hover:text-white transition-colors">
                            <YTIcon />
                          </a>
                        )}
                        {v.showFacebook && links.facebook && (
                          <a href={links.facebook} target="_blank" rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-[#171B28] border border-white/10 flex items-center justify-center text-src-a7aab9 hover:text-white transition-colors">
                            <FBIcon />
                          </a>
                        )}
                        {v.showInstagram && links.instagram && (
                          <a href={links.instagram} target="_blank" rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-[#171B28] border border-white/10 flex items-center justify-center text-src-a7aab9 hover:text-white transition-colors">
                            <IGIcon />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {v.showBio && bio && (
                    <p className="text-slate-400 text-sm leading-relaxed mt-3 break-words">{bio}</p>
                  )}
                </div>
              </div>

              {/* ── Two-column grid ── */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">

                {/* Left — Trayectoria */}
                {v.showExperience && (
                  <div className="bg-[#141829] rounded-[16px] p-5">
                    <h3 className="text-white font-extrabold text-lg mb-4">Trayectoria Profesional</h3>
                    {experience.length > 0 ? (
                      <div className="flex flex-col gap-5">
                        {experience.map((exp, i) => (
                          <div key={i}>
                            <p className="text-white font-bold text-sm">{exp.cargo}</p>
                            <p className="text-src-9fa2ff text-xs mt-0.5">
                              {exp.nombreEmpresa}
                              {exp.fechaInicio && ` • ${fmt(exp.fechaInicio)} - ${exp.actualmenteTrabajando ? 'Present' : fmt(exp.fechaFin)}`}
                            </p>
                            {exp.descripcion && (
                              <p className="text-slate-400 text-xs mt-2 leading-relaxed">{exp.descripcion}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm italic">Sin experiencia registrada</p>
                    )}
                  </div>
                )}

                {/* Right — Skills + Education */}
                <div className="flex flex-col gap-5">

                  {/* Habilidades técnicas */}
                  {v.showTechSkills && (
                    <div>
                      <h3 className="text-white font-bold text-sm mb-3">Habilidades técnicas</h3>
                      {skills.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {skills.map((sk, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <span className="text-src-e5e7f6 text-sm">{sk.name}</span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${LEVEL_COLOR[sk.level] ?? 'text-slate-400'}`}>
                                {sk.level}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-xs italic">Sin habilidades registradas</p>
                      )}
                    </div>
                  )}

                  {/* Habilidades blandas */}
                  {v.showSoftSkills && (
                    <div>
                      <h3 className="text-white font-bold text-sm mb-3">Habilidades blandas</h3>
                      {softSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {softSkills.map((sk, i) => (
                            <span key={i} className="bg-[#171B28] border border-white/10 text-src-e5e7f6 text-xs px-3 py-1 rounded-full">
                              {sk.nombreHabilidad}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-xs italic">Sin habilidades registradas</p>
                      )}
                    </div>
                  )}

                  {/* Formación académica */}
                  {v.showEducation && (
                    <div>
                      <h3 className="text-white font-bold text-sm mb-3">Formación académica</h3>
                      {education.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {education.map((edu, i) => (
                            <div key={i} className="bg-[#171B28] border border-white/5 rounded-[10px] px-4 py-3">
                              <p className="text-white text-xs font-semibold">{edu.carrera}</p>
                              <p className="text-slate-400 text-[11px] mt-0.5">
                                {edu.institucion}
                                {edu.fechaInicio && ` • ${fmt(edu.fechaInicio)}`}
                                {edu.actualmenteEstudiando ? '' : edu.fechaFinalizacion ? ` - ${fmt(edu.fechaFinalizacion)}` : ''}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-xs italic">Sin formación registrada</p>
                      )}
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-10 py-2.5 rounded-full bg-src-9fa2ff text-[#0d1120] font-extrabold text-sm tracking-widest uppercase hover:brightness-110 transition-all cursor-pointer shadow-lg"
          >
            SALIR
          </button>
        </div>

      </div>
    </div>
  );
}
