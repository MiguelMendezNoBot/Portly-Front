const BASE_URL = 'http://localhost:8080';

// ... tus otras funciones como registerUser ...

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Enviamos el JSON exacto que espera tu DTO en Spring Boot
    body: JSON.stringify({ email: email }),
  });

  const json = await response.json().catch(() => ({})); // Captura por si el backend no devuelve JSON

  if (!response.ok) {
    // Lanza el error para que lo capture el frontend
    throw {
      status: response.status,
      message: json.message || 'No se encontró una cuenta con este correo.',
    };
  }

  return json;
};

export const verifyCode = async (email: string, codigo: string) => {
  const response = await fetch(`${BASE_URL}/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Enviamos el JSON exacto que espera tu VerifyCodeRequest en Spring Boot
    body: JSON.stringify({ email, codigo }),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Lanzamos el error con el mensaje de tu InvalidCodeException o CodeExpiredException
    throw {
      status: response.status,
      message: json.message || 'El código es incorrecto o ha expirado.',
    };
  }

  return json;
};

export const resetPassword = async (
  email: string,
  codigo: string,
  nuevaPassword: string
) => {
  const response = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // El JSON exacto que espera tu ResetPasswordRequest
    body: JSON.stringify({ email, codigo, nuevaPassword }),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      status: response.status,
      message: json.message || 'Error al cambiar la contraseña.',
    };
  }

  return json;
};
