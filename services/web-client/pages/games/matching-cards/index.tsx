import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import GameMatchingCardsDashboard from "../../../coomponents/game-matching-cards-dashboard"
import { withAuth } from "../../../middlewares/auth"
import { NSGameMatchingCards } from "../../../ns"

function Game(props: IProps) {
    const router = useRouter()

    const [minStat, setMinStat] = useState<NSGameMatchingCards.IMinStat>({
        globalMinClickTimes: 0,
        myMinClickTimes: 0,
    })
    const [top10UserRanks, setTop10UserRanks] = useState<NSGameMatchingCards.IUserRank[]>([])


    useEffect(() => {
        NSGameMatchingCards.getMinStat().then(r => setMinStat(r))
        NSGameMatchingCards.getTop10UserRanks().then(r => setTop10UserRanks(r))
    }, [])

    const haveSession = (): boolean => {
        return !!props.current_match_id
    }

    const onPlay = async () => {
        if (haveSession()) {
            router.push(`/games/matching-cards/matches/${props.current_match_id}`)
            return
        }

        router.push('/games/matching-cards/matches/new')
    }

    const onGoHome = async () => {
        router.push('/')
    }

    return (
        <div>
            <button onClick={onPlay} className="block w-full rounded px-4 py-3 bg-purple-300 text-4xl font-black fixed top-0 right-0">
                {haveSession() ? 'Resume' : 'Play'}
            </button>
            <div className="mt-16 pt-2">
                <button onClick={onGoHome} className="p-3 bg-gray-200 rounded block mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </button>
                <div className="w-full md:w-7/12 mx-auto mt-4">
                    <GameMatchingCardsDashboard
                        top10UserRanks={top10UserRanks}
                        minStat={minStat}
                    />
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query, req: { cookies } }: GetServerSidePropsContext) => {
    try {

        // set user id on server side
        NSGameMatchingCards.setUserId(cookies?.userId)

        const currentMatch = await NSGameMatchingCards.getCurrentMatch()

        return {
            props: {
                current_match_id: currentMatch.matchId
            }
        }
    } catch (error) {
        return {
            props: {}
        }
    }
}

interface IProps {
    current_match_id?: string
}

export default withAuth(Game)