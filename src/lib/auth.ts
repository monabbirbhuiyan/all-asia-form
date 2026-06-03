import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { sql } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'kyokushin-championship-secret-key-2024';

export type UserRole = 'admin' | 'branch_chief';

export interface SessionUser {
  id: number;
  email: string;
  role: UserRole;
  branchName?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}

export async function authenticateAdmin(email: string, password: string): Promise<SessionUser | null> {
  const result = await sql`
    SELECT id, email, "passwordHash" AS password_hash
    FROM admin_credentials
    WHERE email = ${email}
  `;
  
  if (result.length === 0) return null;
  
  const admin = result[0];
  const isValid = await verifyPassword(password, admin.password_hash);
  
  if (!isValid) return null;
  
  return {
    id: admin.id,
    email: admin.email,
    role: 'admin'
  };
}

export async function authenticateBranchChief(email: string, password: string): Promise<SessionUser | null> {
  const result = await sql`
    SELECT
      id,
      email,
      "passwordHash" AS password_hash,
      "branchName" AS branch_name,
      "isActive" AS is_active
    FROM branch_chiefs
    WHERE email = ${email}
  `;
  
  if (result.length === 0) return null;
  
  const chief = result[0];
  
  if (!chief.is_active) return null;
  
  const isValid = await verifyPassword(password, chief.password_hash);
  
  if (!isValid) return null;
  
  return {
    id: chief.id,
    email: chief.email,
    role: 'branch_chief',
    branchName: chief.branch_name
  };
}
