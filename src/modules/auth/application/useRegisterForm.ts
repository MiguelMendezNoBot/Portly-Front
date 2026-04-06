import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { executeRegisterUseCase } from './registerUseCase';
import { authHttpRepository } from '../infrastructure/authRepository';
import { validateRegisterFields } from '../domain/registerValidation';
import { useToast } from '../../../shared/hooks/useToast';
import { saveToken, saveUsuarioId, saveEmail } from '../../../infrastructure/storage/storage';

interface FormFields {
  nombre: string;
  apellido: string;
  profesion: string;
  email: string;
  biografia: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  nombre?: string;
  apellido?: string;
  profesion?: string;
  email?: string;
  biografia?: string;
  password?: string;
  confirmPassword?: string;
}

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<FormFields>({
    nombre: '',
    apellido: '',
    profesion: '',
    biografia: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { toast, showToast } = useToast();

  const handleChange =
    (field: keyof FormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (step?: number): boolean => {
    const { errors: newErrors, isValid } = validateRegisterFields(fields, step);
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await executeRegisterUseCase(authHttpRepository, fields);
      if (!result.success) {
        setErrors((prev) => ({ ...prev, ...result.errors }));
        showToast('Por favor corrige los errores del formulario', 'error');
        return;
      }

      const data = result.response;
      saveToken(data.token);
      saveUsuarioId(data.idUsuario);
      saveEmail(data.email);
      showToast('¡Cuenta creada exitosamente!', 'success');
      navigate('/');
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      if (err.status === 409 || err.message?.toLowerCase().includes('correo')) {
        setErrors((prev) => ({ ...prev, email: 'Este correo ya está registrado' }));
      }
      showToast(err.message ?? 'Error al registrarse, intenta de nuevo', 'error');
    }
  };

  return { fields, errors, toast, handleChange, handleSubmit, validate };
};
