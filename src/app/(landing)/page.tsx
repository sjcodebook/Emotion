import { signIn } from '@/lib/auth'

const Landing = async () => {
  return (
    <div className='min-h-full flex flex-col'>
      {/* <div className='flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10'>
        <Heading />
      </div> */}
      <form
        action={async (formData) => {
          'use server'
          try {
            const ll = await signIn('credentials', formData)
            console.log('ss========')
            console.log(ll)
          } catch (error) {
            console.log('ss========')
            console.error(error)
          }
        }}>
        <label>
          Email
          <input name='email' type='email' />
        </label>
        <label>
          Password
          <input name='password' type='password' />
        </label>
        <button>Sign In</button>
      </form>
    </div>
  )
}

export default Landing
