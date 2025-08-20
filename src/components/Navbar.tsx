'use client'
import { auth, signOut } from '@/auth'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { User } from 'next-auth';

export default function Navbar(){
    const {data:session} = useSession();
    const pathname = usePathname();
    const [isDashboard,setIsDashboard] = useState(false);
    useEffect(()=>{
        setIsDashboard(pathname==='/dashboard');
    },[pathname]);
    const user : User = session?.user as User;
    return(
        <header>
            <nav className='p-4 md:p-6 shadow-md bg-gray-900 text-white'>
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">

                <Link href='/'>Anonymous Feedback</Link>
                {session ? (
                    <>
                        <span className="mr-4">
                            Welcome, {user?.username || user?.email}
                        </span>
                        <div className='flex gap-4'
                        ><Button className={`${isDashboard ? 'hidden':'block'} w-full md:w-auto bg-slate-100 text-black `} variant='outline'>
                            <Link className="font-bold mb-4 md:mb-0" href='/dashboard'>Dashboard
                            </Link>
                            </Button>
                            <Button onClick={()=>{signOut()}}  className="font-bold w-full md:w-auto bg-slate-100 text-black" variant='outline'>Logout
                            </Button>
                        </div>
                    </>
                ):(
                    <div className='flex gap-4' >
                        <Link href='/sign-in'><Button className="w-full md:w-auto bg-slate-100 text-black cursor-pointer" variant={'outline'}>SignIn</Button>
                        </Link>{' '}
                        <Link href='/sign-up'><Button className="w-full md:w-auto bg-slate-100 text-black cursor-pointer" variant={'outline'}>SignUp</Button>
                        </Link>
                    </div>
                )
                }
                </div>

            </nav>
        </header>
    )
}