import { GetServerSideProps, GetServerSidePropsContext, NextPageContext } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import GameMatchingCards from "../../../../coomponents/game-matching-cards"
import { NSGameMatchingCards } from "../../../../ns"

export default function GameMatchingCardsMatch(props: IProps) {
    const router = useRouter()

    const [minStat, setMinStat] = useState<NSGameMatchingCards.IMinStat>({ myMinClickTimes: 0, globalMinClickTimes: 0 })

    // const onClickCard = async (position: number): Promise<NGameMatchingCards.IClickCardResult> => {
    //     const result = await NGameMatchingCards.createMatch()
    //     return {
    //         cardNumber: 1
    //     }
    // }

    const onCreateNewMatch = async () => {
        router.replace('/games/matching-cards/matches/new')
    }

    const onBack = () => {
        router.push('/games/matching-cards')
    }

    useEffect(() => {
        NSGameMatchingCards.getMinStat().then(r => setMinStat(r) )
    }, [])

    return (
        <GameMatchingCards
            matchId={Number(router.query.matchId)}
            myMinClickTimes={minStat.myMinClickTimes}
            globalMinClickTimes={minStat.globalMinClickTimes}
            clickedTimes={props.matchSessionState?.clickedTimes}
            clickedCardsInRound={props.matchSessionState?.clickedCardsInRound}
            matchedCards={props.matchSessionState?.matchedCards}
            onClickCard={NSGameMatchingCards.clickCard}
            onCreateNewMatch={onCreateNewMatch}
            onBack={onBack}
        />
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }: GetServerSidePropsContext) => {
    const { matchId } = query

    const matchSessionState = await NSGameMatchingCards.getMatchSessionState(Number(matchId))

    return {
        props: {
            matchSessionState
        }
    }
}

interface IProps {
    matchSessionState?: NSGameMatchingCards.IGameMatchingCardsSessionState
}
