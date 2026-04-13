interface DateRangeInputProps<T extends Record<string, any>> {
  formData: T;
  today: string;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  dateFields?: {
    startDateField?: keyof T;
    endDateField?: keyof T;
    isActiveField?: keyof T;
  };
  labels?: {
    startDateLabel?: string;
    endDateLabel?: string;
    currentJobLabel?: string;
  };
  checkboxId?: string;
}

export const DateRangeInput = <T extends Record<string, any>>({
  formData,
  today,
  setFormData,
  dateFields = {
    startDateField: 'fechaInicio' as keyof T,
    endDateField: 'fechaFin' as keyof T,
    isActiveField: 'actualmenteTrabajando' as keyof T,
  },
  labels = {
    startDateLabel: 'Fecha de inicio *',
    endDateLabel: 'Fecha de finalización *',
    currentJobLabel: 'Actualmente trabajo aquí',
  },
  checkboxId = 'currentJob',
}: DateRangeInputProps<T>) => {
  const startField = dateFields.startDateField || ('fechaInicio' as keyof T);
  const endField = dateFields.endDateField || ('fechaFin' as keyof T);
  const activeField =
    dateFields.isActiveField || ('actualmenteTrabajando' as keyof T);

  const startDateValue = (formData[startField] as string) || '';
  const endDateValue = (formData[endField] as string | null) || '';
  const isActive = (formData[activeField] as boolean) || false;

  const handleStartDateChange = (value: string) => {
    setFormData({
      ...formData,
      [startField]: value,
      [endField]: '',
    });
  };

  const handleEndDateChange = (value: string) => {
    setFormData({
      ...formData,
      [endField]: value,
    });
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData({
      ...formData,
      [activeField]: checked,
      [endField]: checked ? null : formData[endField],
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-4 items-end">
      <div>
        <label className="text-[#9ca3af] text-sm block mb-2">
          {labels.startDateLabel}
        </label>
        <input
          type="date"
          max={today}
          onKeyDown={(e) => e.preventDefault()}
          onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
          className="date-input w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-[#9ca3af] text-sm cursor-pointer"
          value={startDateValue}
          onChange={(e) => handleStartDateChange(e.target.value)}
        />
      </div>
      <div className="relative">
        <label className="text-[#9ca3af] text-sm block mb-2">
          {labels.endDateLabel}
        </label>
        <input
          type="date"
          disabled={isActive || !startDateValue}
          onKeyDown={(e) => e.preventDefault()}
          onClick={(e) =>
            !e.currentTarget.disabled &&
            (e.currentTarget as HTMLInputElement).showPicker?.()
          }
          min={startDateValue}
          max={today}
          className="date-input w-full bg-[#1a1c29] border border-white/10 rounded-xl p-3.5 text-[#9ca3af] text-sm disabled:opacity-30 cursor-pointer"
          value={endDateValue}
          onChange={(e) => handleEndDateChange(e.target.value)}
        />
        {!startDateValue && !isActive && (
          <p className="text-[#6c63ff] text-[10px] mt-1 absolute">
            Seleccione fecha de inicio
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <input
          type="checkbox"
          id={checkboxId}
          checked={isActive}
          onChange={(e) => handleActiveChange(e.target.checked)}
          className="w-5 h-5 rounded border-white/10 bg-[#1a1c29] accent-[#6c63ff] shrink-0"
        />
        <label
          htmlFor={checkboxId}
          className="text-[#9ca3af] text-xs leading-tight"
        >
          {labels.currentJobLabel}
        </label>
      </div>
    </div>
  );
};
