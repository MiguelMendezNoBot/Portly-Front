import PestanaEsquina from "../components/PestanaEsquina"
import { RegisterForm } from "../features/auth/components/RegisterForm"
export const RegisterPage = () => {
    return (
        <div className="bg-white p-3 min-h-screen">
            <div className="bg-[#0d152b] rounded-[20px] min-h-[calc(100vh-25px)] flex items-center justify-center py-6">
                <RegisterForm />
                <PestanaEsquina />
            </div>
        </div>
    )
}

