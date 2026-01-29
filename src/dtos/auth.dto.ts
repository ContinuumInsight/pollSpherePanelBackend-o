export interface RegisterDTO {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    createdAt: Date;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}
