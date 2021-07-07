import { useState, useEffect } from "react"
import { NSGameMatchingCards } from "../ns"
import { confirmAlert } from 'react-confirm-alert';

export default function GameMatchingCards(props: IProps) {
    const [clickedTimes, setClickedTimes] = useState(props.clickedTimes || 0)

    // click card in a round, maximun length is 2
    const [clickedCardsInRound, setClickedCardsInRound] = useState<NSGameMatchingCards.ICard[]>(props.clickedCardsInRound || [])

    // mapping between card position and card number
    const [cardPoisitionMapping, setCardPoisitionMapping] = useState<ICardPositionMappingWithCardNumber>(() => {
        let m: ICardPositionMappingWithCardNumber = {}
        props.matchedCards?.map(v => m[v.position] = v.number)
        props.clickedCardsInRound?.map(v => m[v.position] = v.number)
        return m
    })

    const onClickCard = (position: number) => async () => {

        // can't click to opened card
        if (cardPoisitionMapping[position]) return

        // max open 2 card in a round
        if (clickedCardsInRound.length >= 2) return

        let cardNumber: number

        try {
            // find card number and check is matched from api
            const result = await props.onClickCard(props.matchId, position)
            cardNumber = result.cardNumber

        } catch (e) {
            return
        }

        // add clicked times
        setClickedTimes(v => ++v)

        // reveal card
        setCardPoisitionMapping(v => ({ ...v, [position]: cardNumber }))

        // save clicked card
        setClickedCardsInRound(v => [...v, { position, number: cardNumber }])


    }

    const onMatchEnd = () => {
        confirmAlert({
            title: 'Congratulations!',
            message: 'New game?',
            closeOnEscape: false,
            closeOnClickOutside: false,
            buttons: [
                {
                    label: 'Yes',
                    onClick: props.onCreateNewMatch
                },
                {
                    label: 'No',
                    onClick: props.onBack
                }
            ]
        })

    }

    useEffect(() => {
        
        // end round ( 1 round = 2 clicks )
        if (clickedCardsInRound.length == 2) {

            const isMatched = clickedCardsInRound[0].number == clickedCardsInRound[1].number && clickedCardsInRound[0] != null

            if (!isMatched) {
                // if cards don't matched, hide card number
                // delay clear open
                setTimeout(() => {

                    // hide opened cards
                    setCardPoisitionMapping(v => {
                        clickedCardsInRound.map(c => delete v[c.position])
                        return v
                    })

                    // clear clicked card for next round
                    setClickedCardsInRound([])

                }, 500)
            } else {
                setClickedCardsInRound([])
            }


            // end match
            if (Object.keys(cardPoisitionMapping).length == 12) onMatchEnd()


        }
    }, [clickedCardsInRound])


    return (
        <div className="container mx-auto my-10" >
            
            {/* click times */}
            <h2 className="text-2xl font-black text-center mb-6">Click times: {clickedTimes}</h2>

            {/* cards wrapper */}
            <div className="grid grid-cols-3 gap-3 p-1 md:grid-cols-4 md:gap-4md:p-2 md:w-9/12 mx-auto">
                {
                    [...new Array(12)].map((_, i) => {

                        const position = i + 1
                        const number = cardPoisitionMapping[position] || ""

                        return (
                            <div onClick={onClickCard(position)} className={`${!!number ? 'bg-red-300' : 'bg-blue-300'} rounded w-24 h-32 md:w-32 md:h-40 mx-auto cursor-pointer flex justify-center items-center`} key={i}>
                                <span className="text-3xl font-black">{ number }</span>
                            </div>
                        )
                    })
                }
            </div>
            <br />

            {/* best score */}
            <p className="text-center">My best: {props.myMinClickTimes || 0}</p>
            <p className="text-center">Global best: {props.globalMinClickTimes || 0}</p>

            {/* action buttons */}
            <div className="grid grid-cols-2 gap-2 p-4 mt-4 max-w-screen-sm	mx-auto w-full">
                <button onClick={props.onCreateNewMatch} disabled={clickedTimes == 0} className="p-4 bg-purple-200 rounded block">New game</button>
                <button onClick={props.onBack} className="p-4 bg-gray-200 rounded block">Back</button>
            </div>
        </div >
    )
}

interface IProps {
    matchId: string
    myMinClickTimes?: number
    globalMinClickTimes?: number
    clickedTimes?: number
    clickedCardsInRound?: NSGameMatchingCards.ICard[]
    matchedCards?: NSGameMatchingCards.ICard[]
    onClickCard: (matchId: string, position: number) => Promise<NSGameMatchingCards.IClickCardResult>
    onCreateNewMatch: () => void | Promise<void>
    onBack: () => void | Promise<void>
}

interface ICardPositionMappingWithCardNumber {
    [name: number]: number
}
