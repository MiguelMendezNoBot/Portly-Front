export interface LoginFormFields {
  identifier: string;  // puede ser email o nombre de usuario
  password: string;
}

export interface LoginFormErrors {
  identifier?: string;
  password?: string;
}

export function validateLoginFields(fields: LoginFormFields): LoginFormErrors {
  return {
    identifier: !fields.identifier.trim() ? 'El campo es obligatorio' : undefined,
    password: !fields.password ? 'La contraseña es obligatoria' : undefined,
  };
}

export function isLoginFormValid(errors: LoginFormErrors): boolean {
  return Object.values(errors).every((e) => e === undefined);
}
