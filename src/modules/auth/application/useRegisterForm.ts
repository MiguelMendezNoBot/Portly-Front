import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authHttpRepository } from '../infrastructure/authRepository';
import { sendRegistrationCode, verifyRegistrationCode } from '../infrastructure/authService';
import { validateStep1, validateStep3, RegisterFormErrors } from '../domain/registerValidation';
import { useToast } from '../../../shared/hooks/useToast';
import { saveToken, saveUsuarioId, saveEmail } from '../../../infrastructure/storage/storage';

export interface RegisterFields {
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  profesion: string;
  biografia: string;
  password: string;
  confirmPassword: string;
}

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<RegisterFields>({
    email: '',
    username: '',
    nombre: '',
    apellido: '',
    profesion: '',
    biografia: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [codeError, setCodeError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useToast();

  const handleChange =
    (field: keyof RegisterFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const submitStep1 = async (): Promise<boolean> => {
    const { errors: newErrors, isValid } = validateStep1({ email: fields.email });
    setErrors(newErrors);
    if (!isValid) return false;

    setLoading(true);
    try {
      await sendRegistrationCode(fields.email);
      return true;
    } catch {
      showToast('Error al enviar el código. Intenta de nuevo.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitStep2 = async (code: string): Promise<boolean> => {
    if (code.length < 6 || code.includes(' ')) {
      setCodeError('Campo inválido');
      return false;
    }
    setCodeError(undefined);
    setLoading(true);
    try {
      await verifyRegistrationCode(fields.email, code);
      return true;
    } catch {
      setCodeError('Código incorrecto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitStep3 = async (): Promise<boolean> => {
    const { errors: newErrors, isValid } = validateStep3(fields);
    setErrors(newErrors);
    if (!isValid) return false;

    setLoading(true);
    try {
      const data = await authHttpRepository.register({
        username: fields.username.trim().toLowerCase(),
        nombre: fields.nombre,
        apellido: fields.apellido,
        profesion: fields.profesion,
        correoElectronico: fields.email,
        biografia: fields.biografia,
        contrasena: fields.password,
        confirmarContrasena: fields.confirmPassword,
      });
      saveToken(data.token);
      saveUsuarioId(data.idUsuario);
      saveEmail(data.email);
      showToast('¡Cuenta creada exitosamente!', 'success');
      setTimeout(() => navigate('/'), 1200);
      return true;
    } catch (error: unknown) {
      const err = error as { message?: string };
      showToast(err.message ?? 'Error al registrarse, intenta de nuevo.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fields,
    errors,
    codeError,
    loading,
    toast,
    handleChange,
    submitStep1,
    submitStep2,
    submitStep3,
    setCodeError,
  };
};
