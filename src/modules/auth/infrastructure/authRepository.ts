import type { IAuthRepository } from '../application/IAuthRepository';
import { loginUser, registerUser } from './authService';

export const authHttpRepository: IAuthRepository = {
  login: loginUser,
  register: registerUser,
};
