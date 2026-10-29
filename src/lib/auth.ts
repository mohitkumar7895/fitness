import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'fitness_super_secret_jwt_key_2026_production_grade_random_99182';
export const TOKEN_COOKIE_NAME = 'fitlife_auth_token';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'COACH' | 'CUSTOMER';
  avatar?: string;
  phone?: string;
  isActive: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    const user = await queryOne<any>(
      'SELECT id, name, email, role, avatar, phone, is_active FROM users WHERE id = ? AND is_active = 1',
      [decoded.id]
    );

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      isActive: Boolean(user.is_active),
    };
  } catch {
    return null;
  }
}

export async function verifyApiAuth(request: Request, allowedRoles?: string[]): Promise<AuthUser | null> {
  let token: string | undefined;

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  }

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) return null;

  const user = await queryOne<any>(
    'SELECT id, name, email, role, avatar, phone, is_active FROM users WHERE id = ? AND is_active = 1',
    [decoded.id]
  );

  if (!user) return null;

  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    isActive: Boolean(user.is_active),
  };

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(authUser.role)) {
      return null;
    }
  }

  return authUser;
}

