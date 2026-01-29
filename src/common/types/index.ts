import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  type: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type UserRole = 'user' | 'super_admin' | 'finance_manager';
