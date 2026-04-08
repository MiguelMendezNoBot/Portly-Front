const onlyLetters =
  /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]+([a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]*[a-záéíóúüñA-ZÁÉÍÓÚÜÑ])?$/;
const emailValidation =
  /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/;
const passwordValidation =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$*\-/~]).{8,}$/;

export interface RegisterFormFields {
  nombre: string;
  apellido: string;
  profesion: string;
  email: string;
  biografia: string;
  password: string;
  confirmPassword: string;
}

const fieldsByStep: Record<number, (keyof RegisterFormFields)[]> = {
  1: ['email', 'password', 'confirmPassword'],
  2: ['nombre', 'apellido'],
  3: ['profesion', 'biografia'],
};

export interface RegisterFormErrors {
  nombre?: string;
  apellido?: string;
  profesion?: string;
  email?: string;
  biografia?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateAlphaField(
  value: string,
  fieldName: string
): string | undefined {
  if (!value.trim()) return `${fieldName} es obligatorio`;
  if (value.trim().length < 3)
    return `${fieldName} debe tener al menos 3 caracteres`;
  if (value.trim().length > 50)
    return `${fieldName} no puede superar 50 caracteres`;
  if (!onlyLetters.test(value.trim()))
    return `${fieldName} solo acepta letras y espacios`;
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'El correo es obligatorio';
  if (value.length > 320) return 'El correo no puede superar 320 caracteres';
  if (/\s/.test(value)) return 'El correo no puede contener espacios';
  if (!emailValidation.test(value))
    return 'Ingresa un correo válido (ej: nombre@dominio.com)';
  return undefined;
}

export function validateBiografia(value: string): string | undefined {
  if (!value.trim()) return 'La biografia es obligatoria';
  if (value.length > 500)
    return 'La biografia no puede superar los 500 caracteres';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'La contraseña es obligatoria';
  if (!passwordValidation.test(value)) {
    return 'Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo (!#$*-/~)';
  }
  return undefined;
}

export function validateRegisterFields(
  fields: RegisterFormFields,
  step?: number
): { errors: RegisterFormErrors; isValid: boolean } {
  const shouldValidate = (field: keyof RegisterFormFields) =>
    !step || (fieldsByStep[step] ?? []).includes(field);

  const errors: RegisterFormErrors = {};

  if (shouldValidate('email')) errors.email = validateEmail(fields.email);
  if (shouldValidate('password'))
    errors.password = validatePassword(fields.password);
  if (shouldValidate('confirmPassword')) {
    errors.confirmPassword = !fields.confirmPassword
      ? 'Confirma tu contraseña'
      : fields.confirmPassword !== fields.password
        ? 'Las contraseñas no coinciden'
        : undefined;
  }
  if (shouldValidate('nombre'))
    errors.nombre = validateAlphaField(fields.nombre, 'El nombre');
  if (shouldValidate('apellido'))
    errors.apellido = validateAlphaField(fields.apellido, 'El apellido');
  if (shouldValidate('profesion'))
    errors.profesion = validateAlphaField(fields.profesion, 'La profesión');
  if (shouldValidate('biografia'))
    errors.biografia = validateBiografia(fields.biografia);

  const isValid = Object.values(errors).every((e) => e === undefined);
  return { errors, isValid };
}
