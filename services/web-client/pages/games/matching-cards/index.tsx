import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import GameMatchingCardsDashboard from "../../../coomponents/game-matching-cards-dashboard"
import { NSGameMatchingCards } from "../../../ns"

export default function Game(props: IProps) {
    const router = useRouter()

    const [mySummaryStat, setMySummaryStat] = useState<NSGameMatchingCards.ISummaryStat>({
        playingTimes: 0,
        avgClickTimes: 0,
        minClickTimes: 0,
        maxClickTimes: 0,
    })
    const [globalSummaryStat, setGlobalSummaryStat] = useState<NSGameMatchingCards.IGlobalSummaryStat>({
        playingTimes: 0,
        avgClickTimes: 0,
        minClickTimes: 0,
        maxClickTimes: 0,
        players: 0,
    })
    const [top10UserRanks, setTop10UserRanks] = useState<NSGameMatchingCards.IUserRank[]>([])


    useEffect(() => {
        NSGameMatchingCards.getMySummaryStat().then(r => setMySummaryStat(r))
        NSGameMatchingCards.getGlobalSummaryStat().then(r => setGlobalSummaryStat(r))
        NSGameMatchingCards.getTop10UserRanks().then(r => setTop10UserRanks(r))
    }, [])

    const haveSession = (): boolean => {
        return !!props.matchSession?.matchId
    }

    const onPlay = async () => {
        if (haveSession()) {
            router.push(`/games/matching-cards/matches/${props.matchSession?.matchId}`)
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
                        mySummaryState={mySummaryStat}
                        globalSummaryStat={globalSummaryStat}
                    />
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }: GetServerSidePropsContext) => {
    const matchSession = {
        matchId: null
    }

    return {
        props: {
            matchSession
        }
    }
}

interface IProps {
    matchSession?: NSGameMatchingCards.IMatchSession
}
