import { useRouter } from "next/router";
import { useEffect } from "react";
import { NSGameMatchingCards } from "../../../../ns";

export default function NewGameMatchingCardsMatch() {
    const router = useRouter()

    useEffect(() => {
        NSGameMatchingCards.createMatch().then(result => {
            router.replace(`/games/matching-cards/matches/${result.matchId}`)
        })
    }, [])

    return <div />
}