export interface LoginFormFields {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export function validateLoginFields(fields: LoginFormFields): LoginFormErrors {
  return {
    email: !fields.email.trim() ? 'El correo es obligatorio' : undefined,
    password: !fields.password ? 'La contraseña es obligatoria' : undefined,
  };
}

export function isLoginFormValid(errors: LoginFormErrors): boolean {
  return Object.values(errors).every((e) => e === undefined);
}
