import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from '../../types/auth';
import { apiRequest } from './http';
import { tokenUtils } from '../../utils/token';

// 登录API
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/authenticate/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

// 注册API
export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/authenticate/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// 导出tokenUtils以保持向后兼容
export { tokenUtils };
