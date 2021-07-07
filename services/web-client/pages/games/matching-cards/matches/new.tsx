import { useRouter } from "next/router";
import { useEffect } from "react";
import { withAuth } from "../../../../middlewares/auth";
import { NSGameMatchingCards } from "../../../../ns";

function NewGameMatchingCardsMatch() {
    const router = useRouter()

    useEffect(() => {
        NSGameMatchingCards.createMatch().then(result => {
            router.replace(`/games/matching-cards/matches/${result.matchId}`)
        })
    }, [])

    return <div />
}

export default withAuth(NewGameMatchingCardsMatch)