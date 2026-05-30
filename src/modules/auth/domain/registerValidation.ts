const onlyLetters = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]+([a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]*[a-záéíóúüñA-ZÁÉÍÓÚÜÑ])?$/;
const onlyAlphanumeric = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]+$/;
const emailFormat = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/;

export interface RegisterFormFields {
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  profesion: string;
  biografia: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormErrors {
  email?: string;
  username?: string;
  nombre?: string;
  apellido?: string;
  profesion?: string;
  biografia?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Campo inválido';
  if (!emailFormat.test(value)) return 'Formato incorrecto';
  return undefined;
}

export function validateUsername(value: string): string | undefined {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!value.trim()) return 'El nombre de usuario es obligatorio';
  if (value.trim().length < 3 || value.trim().length > 30) return 'Entre 3 y 30 caracteres';
  if (!usernameRegex.test(value.trim())) return 'Solo letras, números y guión bajo (_)';
  return undefined;
}

function validateNameField(value: string): string | undefined {
  if (!value.trim()) return 'Campo inválido';
  if (!onlyLetters.test(value.trim())) return 'Ingrese solo caracteres alfabéticos';
  if (value.trim().length < 3 || value.trim().length > 50) return 'Min 3, Max 50 caracteres';
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return 'Campo inválido';
  if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  return undefined;
}

function validateConfirmPassword(value: string, password: string): string | undefined {
  if (!value) return 'Campo inválido';
  if (value !== password) return 'Las contraseñas no coinciden';
  return undefined;
}

function validateBiografia(value: string): string | undefined {
  if (!value.trim()) return 'Campo inválido';
  if (!onlyAlphanumeric.test(value.trim())) return 'Ingrese solo caracteres alfanumericos';
  if (value.trim().length < 3 || value.trim().length > 500) return 'Min 3, Max 500 caracteres';
  return undefined;
}

function validateProfesion(value: string): string | undefined {
  if (!value.trim()) return 'Campo inválido';
  return undefined;
}

export function validateStep1(fields: Pick<RegisterFormFields, 'email'>): { errors: RegisterFormErrors; isValid: boolean } {
  const errors: RegisterFormErrors = { email: validateEmail(fields.email) };
  return { errors, isValid: !errors.email };
}

export function validateStep3(fields: RegisterFormFields): { errors: RegisterFormErrors; isValid: boolean } {
  const errors: RegisterFormErrors = {
    username: validateUsername(fields.username),
    nombre: validateNameField(fields.nombre),
    apellido: validateNameField(fields.apellido),
    password: validatePassword(fields.password),
    confirmPassword: validateConfirmPassword(fields.confirmPassword, fields.password),
    profesion: validateProfesion(fields.profesion),
    biografia: validateBiografia(fields.biografia),
  };
  return { errors, isValid: Object.values(errors).every((e) => e === undefined) };
}
