import { useEffect, useRef, useState } from 'react';
import Toggle from '../../../../shared/components/Toggle';
import {
  useVisibilityPage,
  type BoolKey,
  type ItemsKey,
} from '../hooks/useVisibilityPage';
import type { Portfolio } from '../../../portfolios/domain/entities/Portfolio';

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-[#6b7280] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

// ─── Portfolio Combobox ───────────────────────────────────────────────────────

interface ComboboxProps {
  portfolios: Portfolio[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

function PortfolioCombobox({
  portfolios,
  selectedId,
  onSelect,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = portfolios.find((p) => p.id === selectedId);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={[
          'w-full flex items-center justify-between px-4 py-3 rounded-[10px]',
          'bg-[#171B28] border text-left transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          open ? 'border-[#7c6bec]/60' : 'border-white/10 hover:border-white/20',
        ].join(' ')}
      >
        <span
          className={`text-sm ${selected ? 'text-[#e5e7f6]' : 'text-[#6b7280]'}`}
        >
          {selected ? selected.nombre : 'Selecciona un portafolio'}
        </span>
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-[#1e2235] border border-white/10 rounded-[10px] shadow-2xl overflow-hidden">
          {portfolios.length === 0 ? (
            <div className="px-4 py-4 text-sm text-[#6b7280] text-center">
              No tienes portafolios creados aún
            </div>
          ) : (
            portfolios.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelect(p.id);
                  setOpen(false);
                }}
                className={[
                  'w-full flex items-center px-4 py-3 text-sm text-left transition-colors hover:bg-white/5',
                  p.id === selectedId
                    ? 'text-[#7c6bec] font-medium'
                    : 'text-[#e5e7f6]',
                ].join(' ')}
              >
                <span className="flex-1">{p.nombre}</span>
                <span
                  className={[
                    'text-xs px-2 py-0.5 rounded-full',
                    p.visibilidad === 'PUBLICO'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-white/5 text-[#6b7280]',
                  ].join(' ')}
                >
                  {p.visibilidad === 'PUBLICO' ? 'Público' : 'Privado'}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────

function ToggleRow({
  label,
  checked,
  onChange,
  indent = false,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  indent?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${indent ? 'pl-8' : ''}`}>
      <span className={`text-sm ${indent ? 'text-[#a7aab9]' : 'text-[#e5e7f6]'}`}>
        {label}
      </span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Expandable Section ───────────────────────────────────────────────────────

interface ExpandableSectionProps {
  title: string;
  sectionKey: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  sectionEnabled: boolean;
  onToggleSection: (value: boolean) => void;
  items: { id: string; label: string }[];
  itemVisibility: Record<string, boolean>;
  onToggleItem: (id: string, value: boolean) => void;
}

function ExpandableSection({
  title,
  isOpen,
  onToggleOpen,
  sectionEnabled,
  onToggleSection,
  items,
  itemVisibility,
  onToggleItem,
}: ExpandableSectionProps) {
  return (
    <div className="bg-[#171B28] border border-white/5 rounded-[12px] overflow-hidden">
      <div
        className="flex items-center gap-4 px-6 py-4 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
        onClick={onToggleOpen}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <Toggle checked={sectionEnabled} onChange={onToggleSection} />
        </div>
        <span className="flex-1 text-[#e5e7f6] text-sm font-medium">
          {title}
        </span>
        <ChevronDown open={isOpen} />
      </div>

      {isOpen && (
        <div className="border-t border-white/5">
          {items.length === 0 ? (
            <div className="px-6 py-5 text-sm text-[#6b7280] text-center">
              No hay elementos registrados en esta sección
            </div>
          ) : (
            <div className="px-6 py-4 flex flex-col gap-3">
              {items.map((item) => (
                <ToggleRow
                  key={item.id}
                  label={item.label}
                  checked={itemVisibility[item.id] ?? true}
                  onChange={(val) => onToggleItem(item.id, val)}
                  indent
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Warning Dialog ───────────────────────────────────────────────────────────

function WarningDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-[#171B28] border border-white/10 rounded-[16px] p-6 max-w-sm w-full mx-4 shadow-2xl">
        <h3 className="text-white font-semibold text-base mb-2">
          Cambios sin guardar
        </h3>
        <p className="text-[#a7aab9] text-sm mb-6">
          Tienes cambios sin guardar, ¿deseas continuar?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-[8px] text-sm text-[#a7aab9] border border-white/10 hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-[8px] text-sm text-white bg-[#7c6bec] hover:bg-[#6d5ed6] transition-colors font-medium"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, isError }: { message: string; isError?: boolean }) {
  return (
    <div
      className={[
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'px-5 py-3 rounded-[10px] shadow-xl text-white text-sm font-medium',
        isError ? 'bg-red-500' : 'bg-[#22c55e]',
      ].join(' ')}
    >
      {message}
    </div>
  );
}

// ─── Section definitions ──────────────────────────────────────────────────────

const GENERAL_TOGGLES: { key: BoolKey; label: string }[] = [
  { key: 'showInstagram', label: 'Mostrar links de Instagram' },
  { key: 'showFacebook', label: 'Mostrar links de Facebook' },
  { key: 'showYoutube', label: 'Mostrar links de YouTube' },
  { key: 'showEmail', label: 'Mostrar Correo electrónico' },
  { key: 'showProfession', label: 'Mostrar Profesión' },
  { key: 'showBio', label: 'Mostrar Descripción profesional' },
];

interface SectionDef {
  key: string;
  title: string;
  sectionBool: BoolKey;
  itemsKey: ItemsKey;
}

const SECTIONS: SectionDef[] = [
  {
    key: 'techSkills',
    title: 'Habilidades técnicas',
    sectionBool: 'showTechSkills',
    itemsKey: 'techSkillItems',
  },
  {
    key: 'softSkills',
    title: 'Habilidades blandas',
    sectionBool: 'showSoftSkills',
    itemsKey: 'softSkillItems',
  },
  {
    key: 'experience',
    title: 'Trayectoria profesional',
    sectionBool: 'showExperience',
    itemsKey: 'experienceItems',
  },
  {
    key: 'education',
    title: 'Formación académica',
    sectionBool: 'showEducation',
    itemsKey: 'educationItems',
  },
  {
    key: 'projects',
    title: 'Proyectos',
    sectionBool: 'showProjects',
    itemsKey: 'projectItems',
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export function VisibilityPage() {
  const {
    portfolios,
    loadingPortfolios,
    dataLoading,
    selectedId,
    selectPortfolio,
    pendingId,
    confirmSwitch,
    cancelSwitch,
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
  } = useVisibilityPage();

  const noPortfolios = !loadingPortfolios && portfolios.length === 0;
  const showSpinner = selectedId !== null && (dataLoading || vis === null);
  const showContent = selectedId !== null && !dataLoading && vis !== null;

  const techSkillItems = profData.skills.map((s) => ({
    id: s.id,
    label: `${s.name} (${s.level})`,
  }));
  const softSkillItems = profData.softSkills.map((s) => ({
    id: String(s.id),
    label: s.nombreHabilidad,
  }));
  const experienceItems = profData.experiences
    .filter((e) => e.id !== undefined)
    .map((e) => ({ id: String(e.id), label: `${e.cargo} — ${e.nombreEmpresa}` }));
  const educationItems = profData.formacion
    .filter((f) => f.idFormacionAcademica !== undefined)
    .map((f) => ({
      id: String(f.idFormacionAcademica),
      label: `${f.carrera} — ${f.institucion}`,
    }));
  const projectItems = profData.projects
    .filter((p) => p.id !== undefined)
    .map((p) => ({ id: String(p.id), label: p.nombre }));

  const sectionItems: Record<ItemsKey, { id: string; label: string }[]> = {
    techSkillItems,
    softSkillItems,
    experienceItems,
    educationItems,
    projectItems,
  };

  return (
    <div className="py-6 max-w-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-white text-xl font-bold">Visibilidad</h2>
        <p className="text-[#6b7280] text-sm mt-1">
          Controla qué información es visible en tu portafolio público.
        </p>
      </div>

      {/* Portfolio selector */}
      <div className="mb-6">
        <label className="block text-[#a7aab9] text-xs font-semibold tracking-[1.2px] uppercase mb-2">
          Portafolio
        </label>
        <PortfolioCombobox
          portfolios={portfolios}
          selectedId={selectedId}
          onSelect={selectPortfolio}
          disabled={loadingPortfolios}
        />
        {noPortfolios && (
          <p className="text-[#6b7280] text-xs mt-2 pl-1">
            No tienes portafolios creados aún
          </p>
        )}
      </div>

      {/* Loading spinner */}
      {showSpinner && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#7c6bec]/30 border-t-[#7c6bec] rounded-full animate-spin" />
        </div>
      )}

      {/* Visibility controls */}
      {showContent && vis && (
        <div className="flex flex-col gap-4">
          {/* General toggles */}
          <div className="bg-[#171B28] border border-white/5 rounded-[12px] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <p className="text-[#a7aab9] text-xs font-semibold tracking-[1.2px] uppercase">
                Información general
              </p>
            </div>
            <div className="px-6 py-4 flex flex-col gap-4">
              {GENERAL_TOGGLES.map(({ key, label }) => (
                <ToggleRow
                  key={key}
                  label={label}
                  checked={vis[key] as boolean}
                  onChange={(val) => toggle(key, val)}
                />
              ))}
            </div>
          </div>

          {/* Expandable sections */}
          {SECTIONS.map((section) => (
            <ExpandableSection
              key={section.key}
              title={section.title}
              sectionKey={section.key}
              isOpen={expandedSection === section.key}
              onToggleOpen={() => toggleExpand(section.key)}
              sectionEnabled={vis[section.sectionBool] as boolean}
              onToggleSection={(val) =>
                toggleSection(section.sectionBool, section.itemsKey, val)
              }
              items={sectionItems[section.itemsKey]}
              itemVisibility={vis[section.itemsKey]}
              onToggleItem={(itemId, val) =>
                toggleItem(section.itemsKey, itemId, val)
              }
            />
          ))}

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={save}
              className={[
                'px-6 py-2.5 rounded-[10px] text-sm font-semibold transition-all duration-200',
                dirty && !saving
                  ? 'bg-[#7c6bec] text-white hover:bg-[#6d5ed6] cursor-pointer'
                  : 'bg-[#7c6bec]/30 text-white/40 cursor-not-allowed',
              ].join(' ')}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Warning dialog */}
      {pendingId && (
        <WarningDialog onConfirm={confirmSwitch} onCancel={cancelSwitch} />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast}
          isError={toast.startsWith('Error')}
        />
      )}
    </div>
  );
}
