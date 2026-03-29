import CornerTab from "../components/CornerTab"
import {LoginForm} from "../features/auth/components/LoginForm"
export const LoginPage = () => {
    return (
        <div className="bg-white p-3 min-h-screen">
            <div className="bg-[#0d152b] rounded-[20px] min-h-[calc(100vh-25px)] flex items-center justify-center py-6">
                <LoginForm/>
                <CornerTab />
            </div>
        </div>
    )
}
