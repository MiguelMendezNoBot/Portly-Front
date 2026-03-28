interface inputProps{
    label: string
    type?: string
    placeholder?: string
    textArea?: boolean
    required?: boolean
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    error?: string
}

export const Input = ({label, type = 'text', placeholder, textArea, required, value, onChange, error}:inputProps) => {
    return (
        <div className="flex flex-col gap-1">
            <label className='text-black text-[13.5px] font-semibold mt-3'>{label}</label>
            {textArea ? (
                <div className="flex flex-col">
                    <textarea
                        placeholder={placeholder}
                        maxLength={500}
                        value={value}
                        onChange={onChange}
                        className={`resize-none w-full text-[12px] px-2 py-1 border rounded-xl outline-none ${error ? 'border-red-400' : 'border-gray-400'}`}
                        required={required}
                    />
                    <span className="text-[10px] text-right block">{value?.length ?? 0}/500</span>
                </div>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full text-xs px-2 pt-2 pb-1 border rounded-xl outline-none ${error ? 'border-red-400' : 'border-gray-400'}`}
                    required={required}
                />
            )}
            {error && <span className="text-red-500 text-[11px]">{error}</span>}
        </div>
    )
}
