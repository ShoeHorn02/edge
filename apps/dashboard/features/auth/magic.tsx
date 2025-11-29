import { ChevronLeftIcon } from 'lucide-react'

import Link from 'next/link'

export function Magic() { 
  return (
      <div className='flex h-full flex-col items-center justify-center py-10 sm:px-5 lg:col-span-3 xl:col-span-2'>
        <div className='w-full max-w-md px-6'>
          <Link href='/login' className='text-muted-foreground group mb-12 flex items-center gap-2 sm:mb-16'>
            <ChevronLeftIcon className='transition-transform duration-200 group-hover:-translate-x-0.5' />
            <p className="text-muted-foreground text-sm text-balance">
              Back to login
            </p>
          </Link>

          <div>
            <h1 className="text-2xl font-bold mb-2">Your access link is on its way!</h1>
            <p className='text-muted-foreground'>
              Check your email and click the link to access your account. If you don&apos;t see it, be sure to look in your spam or promotions folder.
            </p>
          </div>
        </div>
      </div>
  )
}
