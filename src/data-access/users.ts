import db from '@/lib/prisma'

export async function getProfileByEmail(email: string) {
  const profile = await db.user.findUnique({
    where: {
      email,
    },
  })

  return profile
}

export async function getProfileByUserId(userId: string) {
  const profile = await db.user.findUnique({
    where: {
      id: userId,
    },
  })

  return profile
}
