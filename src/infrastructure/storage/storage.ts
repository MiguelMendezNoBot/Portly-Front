export const saveToken = (token: string) =>
  localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

export const saveUsuarioId = (id: string) =>
  localStorage.setItem('usuarioId', id);
export const getUsuarioId = () => localStorage.getItem('usuarioId');

export const saveEmail = (email: string) =>
  localStorage.setItem('email', email);
export const getEmail = () => localStorage.getItem('email');
export const removeEmail = () => localStorage.removeItem('email');
