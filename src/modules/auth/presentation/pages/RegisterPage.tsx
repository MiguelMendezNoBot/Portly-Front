import CornerTab from '../../../../shared/components/CornerTab';
import { RegisterForm } from '../components/RegisterForm';
import { useState } from 'react';
import { Stepper } from '../../../../shared/components/Stepper';

export const RegisterPage = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="bg-white p-3 min-h-screen">
      <div className="relative bg-gradient-to-br bg-[#0f111a] rounded-[20px] min-h-[calc(100vh-25px)] flex items-center justify-center py-6">
        <CornerTab>
          <Stepper currentStep={step} totalSteps={3} />
        </CornerTab>
        <RegisterForm step={step} setStep={setStep} />
      </div>
    </div>
  );
};
