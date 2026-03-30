import { db } from '../../db/index.js';
import { usersTable } from '../../db/schema.js';
import ApiError from '../utils/api-errors.js';
import { eq } from 'drizzle-orm';

import type { RegisterInput } from './dto/register.dto.js';

const register = async ({ name, email, password, role }: RegisterInput) => {
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) throw ApiError.conflict('Email already exists');

  const result = await db
    .insert(usersTable)
    .values({
      name,
      email,
      passwordHash: password, // TODO: hash the password
      role,
    })
    .returning({ id: usersTable.id });
  console.log(result);
  return { data: { id: result[0]?.id } };

  // TODO: send an email to user with token: rawToken
};

export { register };
