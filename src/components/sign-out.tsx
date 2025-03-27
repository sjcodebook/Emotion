import { signOut } from '@/lib/auth'

const Signout = () => {
  return (
    <form
      action={async () => {
        'use server'

        await signOut()
      }}>
      <button type='submit'>Sign out</button>
    </form>
  )
}

export default Signout
