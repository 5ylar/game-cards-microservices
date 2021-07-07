import axios from "axios"
import { GetServerSideProps, GetServerSidePropsContext, NextPageContext } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import GameMatchingCards from "../../../../coomponents/game-matching-cards"
import { withAuth } from "../../../../middlewares/auth"
import { NSGameMatchingCards } from "../../../../ns"

function GameMatchingCardsMatch(props: IProps) {
    const router = useRouter()

    const [minStat, setMinStat] = useState<NSGameMatchingCards.IMinStat>({ myMinClickTimes: 0, globalMinClickTimes: 0 })

    const onCreateNewMatch = async () => {
        router.replace('/games/matching-cards/matches/new')
    }

    const onBack = () => {
        router.push('/games/matching-cards')
    }

    useEffect(() => {
        NSGameMatchingCards.getMinStat().then(r => setMinStat(r))
    }, [])

    return (
        <GameMatchingCards
            matchId={String(router.query.matchId)}
            myMinClickTimes={minStat.myMinClickTimes}
            globalMinClickTimes={minStat.globalMinClickTimes}
            clickedTimes={props.matchSessionState?.clickTimes}
            clickedCardsInRound={props.matchSessionState?.previousPickupCard ? [props.matchSessionState.previousPickupCard] : []}
            matchedCards={props.matchSessionState?.activatedCards}
            onClickCard={NSGameMatchingCards.clickCard}
            onCreateNewMatch={onCreateNewMatch}
            onBack={onBack}
        />
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query, req: { cookies } }: GetServerSidePropsContext) => {
    const { matchId } = query

    console.log('matchId',matchId)
    console.log('cookies',cookies)

    // set user id on server side
    NSGameMatchingCards.setUserId(cookies?.userId)

    try {
        const matchSessionState = await NSGameMatchingCards.getMatchSessionState(String(matchId))
        return {
            props: {
                matchSessionState
            },
        }
    } catch (error) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    }
}

interface IProps {
    matchSessionState?: NSGameMatchingCards.IGameMatchingCardsSessionState
}

export default withAuth(GameMatchingCardsMatch)
