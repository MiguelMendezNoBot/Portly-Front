import CornerTab from "../components/CornerTab"
import { RegisterForm } from "../features/auth/components/RegisterForm"
import { useState } from 'react'
import { Stepper } from "../features/auth/components/Stepper"


export const RegisterPage = () => {
    const [step, setStep] = useState(1)
    return (
        <div className="bg-white p-3 min-h-screen">
            <div className="relative bg-[#0d152b] rounded-[20px] min-h-[calc(100vh-25px)] flex items-center justify-center py-6">
                <CornerTab>
                    <Stepper currentStep={step} totalSteps={3} />
                </CornerTab>
                <RegisterForm step={step} setStep={setStep} />
            </div>
        </div>
    )
}

