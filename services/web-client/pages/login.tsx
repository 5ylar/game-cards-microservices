import 'tailwindcss/tailwind.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const router = useRouter()

    const onLogin = (form: ILoginForm) => {
        console.log('form', form)
        router.push("/")
    }

    return (
        <div className="container mx-auto my-10" >
            <form className="w-10/12 md:w-8/12 mx-auto bg-blue-300 p-4 rounded space-y-4" onSubmit={handleSubmit(onLogin)}>
                <input className="block w-full rounded px-4 py-2" {...register('username')} />
                <input className="block w-full rounded px-4 py-2" {...register('password')} type="password" />
                <button className="block w-full rounded px-4 py-2" type="submit">Login</button>
            </form>
        </div>
    )
}

interface ILoginForm {
    username: string
    password: string
}