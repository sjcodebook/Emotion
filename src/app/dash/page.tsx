import { signIn, auth } from '@/lib/auth'

const Landing = async () => {
  const session = await auth()

  return (
    <div className='min-h-full flex flex-col'>
      {/* <div className='flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10'>
        <Heading />
      </div> */}

      {console.log(session)}
    </div>
  )
}

export default Landing
