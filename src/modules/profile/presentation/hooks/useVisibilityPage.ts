import { useState, useEffect, useCallback, useRef } from 'react';
import { usePortfolios } from '../../../portfolios/application/usePortfolios';
import { useProfessionalData } from '../../../portfolios/application/useProfessionalData';
import { useUserProfile } from '../../application/useUserProfile';
import type { UserProfileEntity } from '../../domain/userProfile.entity';
import type { PortfolioItemVisibilidad } from '../../../portfolios/domain/entities/Portfolio';
import type { Skill } from '../../../professional/domain/entities/Skill';
import type { SoftSkill } from '../../../professional/domain/entities/SoftSkill';
import type { Experience } from '../../../professional/domain/entities/Experience';
import type { FormacionAcademica } from '../../../professional/domain/entities/FormacionAcademica';
import type { ActualizacionAcademica } from '../../../professional/domain/entities/ActualizacionAcademica';
import type { Project } from '../../../professional/domain/entities/Project';

export interface VisibilityState {
  showPhone: boolean;
  showNationality: boolean;
  showLinkedin: boolean;
  showGithub: boolean;
  showInstagram: boolean;
  showFacebook: boolean;
  showYoutube: boolean;
  showEmail: boolean;
  showProfession: boolean;
  showBio: boolean;
  showTechSkills: boolean;
  showSoftSkills: boolean;
  showExperience: boolean;
  showEducation: boolean;
  showActualizacion: boolean;
  showProjects: boolean;
  techSkillItems: Record<string, boolean>;
  softSkillItems: Record<string, boolean>;
  experienceItems: Record<string, boolean>;
  educationItems: Record<string, boolean>;
  actualizacionItems: Record<string, boolean>;
  projectItems: Record<string, boolean>;
}

export type ItemsKey =
  | 'techSkillItems'
  | 'softSkillItems'
  | 'experienceItems'
  | 'educationItems'
  | 'actualizacionItems'
  | 'projectItems';

export type BoolKey = Exclude<keyof VisibilityState, ItemsKey>;

const ITEMS_TO_BOOL: Record<ItemsKey, BoolKey> = {
  techSkillItems: 'showTechSkills',
  softSkillItems: 'showSoftSkills',
  experienceItems: 'showExperience',
  educationItems: 'showEducation',
  actualizacionItems: 'showActualizacion',
  projectItems: 'showProjects',
};

function allTrue<T extends object>(
  items: T[],
  getId: (item: T) => string | undefined
): Record<string, boolean> {
  return items.reduce(
    (acc, item) => {
      const id = getId(item);
      return id !== undefined ? { ...acc, [id]: true } : acc;
    },
    {} as Record<string, boolean>
  );
}

interface BuildVisibilityData {
  skills: Skill[];
  softSkills: SoftSkill[];
  experiences: Experience[];
  formacion: FormacionAcademica[];
  actualizaciones: ActualizacionAcademica[];
  projects: Project[];
}

function buildVisibility(
  profile: UserProfileEntity,
  portfolioItemVis: PortfolioItemVisibilidad | undefined,
  data: BuildVisibilityData
): VisibilityState {
  const stored = portfolioItemVis ?? {};
  const v = profile.visibility;
  const { skills, softSkills, experiences, formacion, actualizaciones, projects } = data;

  return {
    showPhone: v.showPhone ?? true,
    showNationality: v.showNationality ?? true,
    showLinkedin: v.showLinkedin ?? true,
    showGithub: v.showGithub ?? true,
    showInstagram: v.showInstagram,
    showFacebook: v.showFacebook,
    showYoutube: v.showYoutube,
    showEmail: v.showEmail,
    showProfession: v.showProfession,
    showBio: v.showBio,
    showTechSkills: v.showTechSkills,
    showSoftSkills: v.showSoftSkills,
    showExperience: v.showExperience,
    showEducation: v.showEducation,
    showActualizacion: v.showActualizacion ?? true,
    showProjects: stored.showProjects ?? true,
    techSkillItems:
      stored.techSkillItems ?? allTrue(skills, (s) => s.id),
    softSkillItems:
      stored.softSkillItems ??
      allTrue(softSkills, (s) => String(s.id)),
    experienceItems:
      stored.experienceItems ??
      allTrue(experiences, (e) =>
        e.id === undefined ? undefined : String(e.id)
      ),
    educationItems:
      stored.educationItems ??
      allTrue(formacion, (f) =>
        f.idFormacionAcademica === undefined ? undefined : String(f.idFormacionAcademica)
      ),
    actualizacionItems:
      stored.actualizacionItems ??
      allTrue(actualizaciones, (a) =>
        a.idActualizacionAcademica === undefined ? undefined : String(a.idActualizacionAcademica)
      ),
    projectItems:
      stored.projectItems ??
      allTrue(projects, (p) =>
        p.id === undefined ? undefined : String(p.id)
      ),
  };
}

export function useVisibilityPage() {
  const { portfolios, loading: loadingPortfolios, updateVisibilidad } = usePortfolios();
  const { data: profData, loading: loadingProfData } = useProfessionalData();
  const { profile, saving, saveProfile } = useUserProfile();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [vis, setVis] = useState<VisibilityState | null>(null);
  const [baselineVis, setBaselineVis] = useState<string>('{}');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadedPortfolioRef = useRef<string | null>(null);
  const dataReady = !loadingProfData && !!profile;

  useEffect(() => {
    if (!selectedId || !dataReady) return;
    if (loadedPortfolioRef.current === selectedId) return;
    loadedPortfolioRef.current = selectedId;

    const portfolioItemVis = portfolios.find((p) => p.id === selectedId)?.itemVisibilidad;
    const v = buildVisibility(
      profile!,
      portfolioItemVis,
      {
        skills: profData.skills,
        softSkills: profData.softSkills,
        experiences: profData.experiences,
        formacion: profData.formacion,
        actualizaciones: profData.actualizaciones,
        projects: profData.projects,
      }
    );
    setVis(v);
    setBaselineVis(JSON.stringify(v));
  }, [selectedId, dataReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = vis !== null && JSON.stringify(vis) !== baselineVis;

  const selectPortfolio = useCallback((id: string) => {
    loadedPortfolioRef.current = null;
    setSelectedId(id);
    setExpandedSection(null);
  }, []);

  const cancel = useCallback(() => {
    loadedPortfolioRef.current = null;
    setSelectedId(null);
    setVis(null);
    setBaselineVis('{}');
    setExpandedSection(null);
  }, []);

  const toggle = useCallback((key: BoolKey, value: boolean) => {
    setVis((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const toggleItem = useCallback(
    (section: ItemsKey, itemId: string, value: boolean) => {
      setVis((prev) => {
        if (!prev) return prev;
        const newItems = { ...prev[section], [itemId]: value };
        const allOff = Object.values(newItems).every((v) => !v);
        const sectionBool = ITEMS_TO_BOOL[section];
        const sectionOn = value ? true : allOff ? false : (prev[sectionBool] as boolean);
        return { ...prev, [section]: newItems, [sectionBool]: sectionOn };
      });
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const toggleSection = useCallback(
    (sectionBool: BoolKey, itemsKey: ItemsKey, value: boolean) => {
      setVis((prev) => {
        if (!prev) return prev;
        const newItems = Object.keys(prev[itemsKey]).reduce(
          (acc, k) => ({ ...acc, [k]: value }),
          {} as Record<string, boolean>
        );
        return { ...prev, [sectionBool]: value, [itemsKey]: newItems };
      });
    },
    []
  );

  const toggleExpand = useCallback((section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);

  const save = useCallback(async () => {
    if (!vis || !profile || !selectedId) return;
    try {
      await saveProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        profession: profile.profession,
        bio: profile.bio,
        visibility: {
          showPhone: vis.showPhone,
          showNationality: vis.showNationality,
          showLinkedin: vis.showLinkedin,
          showGithub: vis.showGithub,
          showInstagram: vis.showInstagram,
          showFacebook: vis.showFacebook,
          showYoutube: vis.showYoutube,
          showEmail: vis.showEmail,
          showProfession: vis.showProfession,
          showBio: vis.showBio,
          showTechSkills: vis.showTechSkills,
          showSoftSkills: vis.showSoftSkills,
          showExperience: vis.showExperience,
          showEducation: vis.showEducation,
          showActualizacion: vis.showActualizacion,
        },
      });

      await updateVisibilidad(selectedId, {
        showProjects: vis.showProjects,
        techSkillItems: vis.techSkillItems,
        softSkillItems: vis.softSkillItems,
        experienceItems: vis.experienceItems,
        educationItems: vis.educationItems,
        actualizacionItems: vis.actualizacionItems,
        projectItems: vis.projectItems,
      });

      loadedPortfolioRef.current = null;
      setSelectedId(null);
      setVis(null);
      setBaselineVis('{}');
      setExpandedSection(null);
      setToast('Cambios guardados exitosamente');
      setTimeout(() => setToast(null), 3500);
    } catch {
      setToast('Error al guardar cambios');
      setTimeout(() => setToast(null), 3500);
    }
  }, [vis, profile, selectedId, saveProfile, updateVisibilidad]);

  return {
    portfolios,
    loadingPortfolios,
    dataLoading: loadingProfData || !profile,
    selectedId,
    selectPortfolio,
    cancel,
    vis,
    toggle,
    toggleItem,
    toggleSection,
    expandedSection,
    toggleExpand,
    dirty,
    save,
    saving,
    toast,
    profData,
  };
}
