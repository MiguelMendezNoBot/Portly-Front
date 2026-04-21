import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import BotonInicio from '../../../../shared/components/BotonInicio';

export const RegisterPage = () => {
    const [step, setStep] = useState(1);
    return (
        <div className="min-h-screen bg-white p-2 md:p-4 box-border">
            <div className="relative w-full min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] bg-src-0f111a rounded-[2rem] flex items-center justify-center shadow-2xl">
                <BotonInicio>
                    <Link
                        to="/"
                        className="text-src-1c1154 hover:opacity-70 transition-opacity font-extrabold text-xs uppercase tracking-wide md:bg-transparent md:px-0 md:py-0 md:rounded-none md:shadow-none bg-src-9fa2ff px-5 py-2.5 rounded-full shadow-lg inline-block"
                        aria-label="Ir al inicio"
                    >
                        VOLVER AL INICIO
                    </Link>
                    <div className="hidden md:block w-px h-4 bg-src-1c1154/30" />
                    <span className="hidden md:inline bg-src-1a1b41 text-white font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wide">
                        PASO {step}
                    </span>
                </BotonInicio>
                <RegisterForm step={step} setStep={setStep} />
            </div>
        </div>
    );
};
