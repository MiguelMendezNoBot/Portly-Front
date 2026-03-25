import {Input} from '../../../components/Input'

export const RegisterForm = () => {
    return (
            <div className="w-[33rem] p-10 bg-white rounded-[35px] ">
                <div className="pb-5 text-center">
                    <h1 className="font-bold text-[33px]">Crea tu cuenta</h1>
                    <h2 className="text-gray-500 font-thin text-[13px]">Registrate en el sistema, mediante el siguiente formulario</h2>
                </div>
                <form>
                    <div className='flex gap-5'>
                        <div className='flex-1'>
                            <Input label="Nombre" type="text" required placeholder="Nombre" />
                        </div>
                        <div className='flex-1'>
                            <Input label="Apellido" type="text" required placeholder="Apellido"/>
                        </div>
                    </div>
                    <Input label="Profesion" required type="text" placeholder="Ej: Diseñador UI/UX"/>
                    <Input label="Correo electronico" required type="email" placeholder="nombre@dominio.com"/>
                    <Input label="Biografia" textArea required type="text-area" placeholder="Cuentanos un poco sobre ti..."/>
                    <Input label="Contraseña" required type="password"/>
                    <Input label="Confirmar Contraseña" required type="password"/>
                    <div >
                        <button type='submit' className="mt-8 w-full py-3 rounded-lg text-white font-medium bg-[#6C63FF]" >Registrarse</button>
                        <div className="text-center mt-2">
                            <span className="text-gray-500 text-sm">¿Ya tienes cuenta? </span>
                            {/* //cambiar a link */}
                            <span className="text-[#6C63FF] font-medium text-sm cursor-pointer">Iniciar Sesión</span>
                        </div>
                    </div>
                </form>
            </div>
    )
}
