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
                        className="text-src-1c1154 hover:opacity-70 transition-opacity flex items-center"
                        aria-label="Ir al inicio"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                            <path d="M9 21V12h6v9" />
                        </svg>
                    </Link>
                    <div className="w-px h-4 bg-src-1c1154/30" />
                    <span className="bg-src-1a1b41 text-white font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wide">
                        PASO {step}
                    </span>
                </BotonInicio>
                <RegisterForm step={step} setStep={setStep} />
            </div>
        </div>
    );
};
