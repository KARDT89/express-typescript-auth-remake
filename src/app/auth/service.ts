import { db } from '../../db/index.js';
import { usersTable } from '../../db/schema.js';
import ApiError from '../utils/api-errors.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import type { RegisterInput } from './dto/register.dto.js';
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from '../utils/jwt-utils.js';
import { comparePassword, hashPassword } from '../utils/password-hashing.js';
import type { LoginInput } from './dto/login.dto.js';

const hashToken = (token: string) =>
  crypto.createHash('sha256').update(String(token)).digest('hex');

const register = async ({ name, email, password, role }: RegisterInput) => {
  //check if user exists already
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (existing.length > 0) throw ApiError.conflict('Email already exists');

  // generate Reset token
  const { rawToken, hashedToken } = generateResetToken();

  // hash the password before db save
  const hashedPassword = await hashPassword(password);

  // if new user, create a new user
  const result = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken: hashedToken,
    })
    .returning({ id: usersTable.id });

  return { data: { id: result[0]!.id } };

  // TODO: send an email to user with token: rawToken
};

const login = async ({ email, password }: LoginInput) => {
  // check if user exists
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (existing.length === 0) throw ApiError.notFound('User not found');
  const user = existing[0]!;

  // check if email is verified
  if (!user.isVerified) throw ApiError.unauthorized('Email not verified');

  // check if password matches
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw ApiError.unauthorized('Invalid credentials');

  // generete access and refresh tokens
  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });

  // hash the reset token before saving to db
  const hashedRefreshToken = hashToken(refreshToken);
  const result = await db
    .update(usersTable)
    .set({ refreshToken: hashedRefreshToken })
    .where(eq(usersTable.id, user.id));

  return { user: user.id, accessToken, refreshToken };
};

export { register, login };
