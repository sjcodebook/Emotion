import { createUser, getProfileByEmail, getProfileByUserId } from '@/data-access/users'
import { hashPassword } from '@/lib/utils'
import { env } from '@/env'

export async function getUserProfileByEmailUseCase(email: string) {
  const profile = await getProfileByEmail(email)
  return profile
}

export async function verifyUserPasswordUseCase({
  userId,
  password,
}: {
  userId: string
  password: string
}) {
  if (!userId || !password) {
    return false
  }
  const profile = await getProfileByUserId(userId)
  if (!profile || !profile.hashedPassword) {
    return false
  }
  // Check if the password is correct
  const pwHash = await hashPassword(password, env.HASH_SALT)
  return profile.hashedPassword === pwHash
}

export async function createUserUseCase({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) {
  const pwHash = await hashPassword(password, env.HASH_SALT)
  const profile = await getProfileByEmail(email)
  if (profile) {
    return { error: 'User already exists. Please login.' }
  }
  return await createUser({ name, email, hashedPassword: pwHash })
}
