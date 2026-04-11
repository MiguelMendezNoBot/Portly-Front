import CornerTab from '../../../../shared/components/CornerTab';
import { RegisterForm } from '../components/RegisterForm';
import { useState } from 'react';
import { Stepper } from '../../../../shared/components/Stepper';

export const RegisterPage = () => {
    const [step, setStep] = useState(1)
    return (
        <div className="min-h-screen bg-white p-2 md:p-4 box-border">
            <div className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] bg-src-0f111a rounded-[2rem] flex items-center justify-center  shadow-2xl">
                <CornerTab>
                    <Stepper currentStep={step} totalSteps={3} />
                </CornerTab>
                <RegisterForm step={step} setStep={setStep} />
            </div>
        </div>
    )
}

