import 'tailwindcss/tailwind.css'
import { useCookie } from 'next-cookie'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form';

export default function Login() {

    const router = useRouter()
    const cookie = useCookie()

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onLogin = (form: ILoginForm) => {
        cookie.set("userId", form.username, { path: '/' })
        router.push("/")
    }

    return (
        <div className="container mx-auto my-24" >
            <form className="w-10/12 md:w-6/12 mx-auto p-4 rounded space-y-4" onSubmit={handleSubmit(onLogin)}>
                <input className="block w-full rounded px-4 py-2 border text-center" placeholder="username" {...register('username')} />
                <button className="bg-blue-300 block w-full rounded px-4 py-2" type="submit">Go!</button>
            </form>
        </div>
    )
}

interface ILoginForm {
    username: string
}