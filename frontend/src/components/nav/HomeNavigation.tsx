import Link from 'next/link'
import React from 'react'

export default function HomeNavigation() {
  return (
    <>
        <Link
            className='text-white p-2 mr-2 uppercase font-black text-xs cursor-pointer'
            href='/auth/login'
        >Iniciar Sesion</Link>

        <Link
            className='bg-blue-500 text-slate-800 p-2 uppercase font-black text-xs cursor-pointer rounded-lg'
            href='/auth/register'
        >Registrarse</Link>
    </>
  )
}
