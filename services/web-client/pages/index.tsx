import { PlayIcon } from '@heroicons/react/solid'
import { useCookie } from 'next-cookie'
import { useRouter } from 'next/router'

export default function Home() {

  const router = useRouter()
  const cookie = useCookie()

  const goToGameMatchingCards = () => {
    router.push('/games/matching-cards')
  }

  return (
    <div className="py-16 md:py-32">
      <h2 className="font-bold mb-2 text-center text-4xl md:text-6xl">Welcome</h2>
      <h2 className="font-black mb-2 text-purple-400 text-center text-6xl md:text-8xl">{ cookie.get("userId") }</h2>

      {/* Quick play */}
      <h2 className="font-bold mb-2 text-center text-4xl md:text-4xl mt-24">Quick play</h2>
      <section className="w-10/12 mx-auto mt-6 flex justify-center items-center">
          <div onClick={goToGameMatchingCards} className="block rounded bg-blue-300 w-full md:w-4/12 p-4 cursor-pointer">
            <PlayIcon className="h-5 w-20 h-20 text-blue-500 mx-auto" />
            <p className="text-center mt-4">Game Maching Cards</p>
          </div>
      </section>
    </div>
  )
}
