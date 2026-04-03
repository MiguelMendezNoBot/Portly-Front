import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from './SocialIcons'
interface inputProps{
    label: string
    type?: string
    placeholder?: string
    textArea?: boolean
    select?: boolean
    options?: string[]
    required?: boolean
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    error?: string
}

export const Input = ({label, type = 'text', placeholder, textArea, required, value, onChange, error,select,options=[]}:inputProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className="flex flex-col gap-1">
            <label className='text-black text-[13.5px] font-semibold mt-3'>{label}</label>
            {select ? (
                <select value={value} onChange={onChange} required={required} className={`w-full text-xs px-2 pt-2 pb-1 border rounded-xl outline-none bg-white ${error ? 'border-red-400' : 'border-gray-400'}`} >
                    <option value="">{placeholder ?? 'Selecciona una opción'}</option>
                    {options.map(op => (
                        <option key={op} value={op}>{op}</option>
                    ))}
                </select>
            ) :textArea ? (
                <div className="flex flex-col">
                    <textarea
                        placeholder={placeholder}
                        maxLength={500}
                        value={value}
                        onChange={onChange}
                        className={`resize-none w-full text-[12px] px-2 py-1 border rounded-xl outline-none ${error ? 'border-red-400' : 'border-gray-400'}`}
                        required={required}
                    />
                    <span className="text-[10px] mt-1 text-right block">{value?.length ?? 0}/500</span>
                </div>
            ) : (
                <div className="relative">
                    <input
                        type={inputType}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        className={`w-full text-xs px-2 pt-2 pb-1 border rounded-xl outline-none ${isPassword ? 'pr-8' : ''} ${error ? 'border-red-400' : 'border-gray-400'}`}
                        required={required}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            )}
            {error && <span className="text-red-500 text-[11px]">{error}</span>}
        </div>
    )
}
