import { Request } from 'express';
import { UserRole } from '../constants/roles.constants';

export interface AuthPayload {
  id: number;
  email: string;
  roles: UserRole[];
}

export interface AuthenticatedRequest extends Request {
  user: AuthPayload;
}
