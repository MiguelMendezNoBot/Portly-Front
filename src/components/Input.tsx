interface inputProps{
    label:string,
    type?:string,
    placeholder?:string,
    textArea?: boolean,
    required?: boolean,
}

export const Input = ({label,type='text',placeholder,textArea,required}:inputProps) => {
    return (
        <div className="flex flex-col gap-1">
            <label className='text-black text-[13.5px] font-semibold py-1'>{label}</label>
            {textArea ? (
                <div className="flex-col">
                    <textarea
                        placeholder={placeholder}
                        maxLength={500}
                        className="resize-none w-full text-[12px] px-2 py-3 border  border-gray-400 rounded-xl outline-none"
                        required={required}
                    />
                    <span className="text-[10px] text-right block">Max. 500 caracteres</span>
                </div>
                
            ):(
                <input type={type} placeholder={placeholder} className="w-full text-[12px] px-2 py-3 border  border-gray-400 rounded-xl outline-none" required={required}/>
            )}
        </div>
    )
}
