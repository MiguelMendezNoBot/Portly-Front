import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { Stepper } from '../../../../shared/components/Stepper';
import BotonInicio from '../../../../shared/components/BotonInicio';

export const RegisterPage = () => {
    const [step, setStep] = useState(1);
    return (
        <div className="min-h-screen bg-white p-2 md:p-4 box-border">
            <div className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] bg-src-0f111a rounded-[2rem] flex items-center justify-center shadow-2xl">
                <BotonInicio>
                    <Link
                        to="/"
                        className="text-src-1c1154 font-extrabold text-xs uppercase tracking-wide hover:opacity-70 transition-opacity"
                    >
                        INICIO
                    </Link>
                    <div className="w-px h-4 bg-src-1c1154/30" />
                    <Stepper currentStep={step} totalSteps={3} />
                </BotonInicio>
                <RegisterForm step={step} setStep={setStep} />
            </div>
        </div>
    );
};
