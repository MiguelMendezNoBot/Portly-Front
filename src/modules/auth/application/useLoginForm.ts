import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { executeLoginUseCase } from './loginUseCase';
import { authHttpRepository } from '../infrastructure/authRepository';
import { useToast } from '../../../shared/hooks/useToast';
import { saveToken, saveUsuarioId, saveEmail } from '../../../infrastructure/storage/storage';

interface FormFields {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<FormFields>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast, showToast } = useToast();

  const handleChange =
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await executeLoginUseCase(authHttpRepository, fields);
      if (!result.success) {
        setErrors(result.errors);
        return;
      }
      const data = result.response;
      saveToken(data.token);
      saveUsuarioId(data.idUsuario);
      saveEmail(data.email);
      showToast('¡Bienvenido!', 'success');
      setTimeout(() => navigate('/'), 1500);
    } catch {
      showToast('Credenciales inválidas', 'error');
    }
  };

  return { fields, errors, toast, handleChange, handleSubmit };
};
