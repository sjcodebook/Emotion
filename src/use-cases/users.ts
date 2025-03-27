import { getProfileByEmail, getProfileByUserId } from '@/data-access/users'
import { hashPassword } from '@/lib/utils'
// import { signIn } from '@/lib/auth'
import { env } from '@/env'

export async function getUserProfileByEmailUseCase(email: string) {
  const profile = await getProfileByEmail(email)
  return profile
}

export async function verifyUserPasswordUseCase(userId: string, password: string) {
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
