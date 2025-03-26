import crypto from 'crypto'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const ITERATIONS = 10000

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(plainTextPassword, salt, ITERATIONS, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err)
      resolve(derivedKey.toString('hex'))
    })
  })
}
