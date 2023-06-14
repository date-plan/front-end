import { LoginFormData } from '../../types/login/loginFormType';
import request from '../base';

export const handleLogin = (loginInfo: LoginFormData) => {
  return request({
    method: 'POST',
    url: '/api/auth/login',
    data: loginInfo,
  });
};
