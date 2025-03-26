import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z.string().optional(),
    AUTH_SECRET: z.string().min(1),
    HOST_NAME: z.string().min(1),
    HASH_SALT: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    HOST_NAME: process.env.HOST_NAME,
    HASH_SALT: process.env.HASH_SALT,
  },
})
