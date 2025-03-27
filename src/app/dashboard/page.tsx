import { auth } from '@/lib/auth'

import SignOut from '@/components/sign-out'

const Landing = async () => {
  const session = await auth()

  return (
    <div className='min-h-full flex flex-col'>
      {/* <div className='flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10'>
        <Heading />
      </div> */}
      <h1>{session ? JSON.stringify(session) : ''}</h1>

      <SignOut />

      {console.log(session)}
    </div>
  )
}

export default Landing
