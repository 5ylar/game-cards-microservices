
export namespace NSGameMatchingCards {

    export const GAME_ID = 'MATCHING_CARDS'

    export const createMatch = async (): Promise<IMatch> => {
        return {
            matchId: 2,
            gameId: ""
        }
    }
    
    export const getMatchSessionState = async (matchId: number): Promise<IGameMatchingCardsSessionState> => {
        return {
            matchId: 1,
            clickedTimes: 1,
            clickedCardsInRound: [{ position: 1, cardNumber: 1 }],
            matchedCards: [{ position: 2, cardNumber: 2 }, { position: 3, cardNumber: 2 }],
        }
    }
    
    export const clickCard = async (position: number): Promise<IClickCardResult> => {
    
        return {
            cardNumber: Math.round(6),
        }
    }
    
    export const getGlobalSummaryStat = async (): Promise<IGlobalSummaryStat> => {
        return {
            minClickTimes: 1,
            maxClickTimes: 1,
            avgClickTimes: 1,
            players: 1,
            playingTimes: 1,
        }
    }
    
    export const getMySummaryStat = async (): Promise<ISummaryStat> => {
        return {
            minClickTimes: 1,
            maxClickTimes: 1,
            avgClickTimes: 1,
            playingTimes: 1,
        }
    }

    export const getMinStat = async (): Promise<IMinStat> => {
        return {
            myMinClickTimes: 1,
            globalMinClickTimes: 1,
        }
    }
    
    export const getMyMatchSession = async (): Promise<IMatchSession> => {
        return {
            matchId: 2,
        }
    }

    export const getTop10UserRanks = async (): Promise<IUserRank[]> => {
        return []
    }


    export interface IMatch {
        matchId: number
        gameId: string
    }

    export interface IMatchSession {
        matchId: number
    }
    
    
    export interface IClickCardResult {
        cardNumber: number
        isMatched?: boolean | null
    }

    export interface ICardNumberPosition {
        position: number;
        cardNumber: number
    }
    
    export interface IGameMatchingCardsSessionState {
        matchId: number
        clickedTimes: number
        clickedCardsInRound: ICardNumberPosition[]
        matchedCards: ICardNumberPosition[]
    }
    
    export interface ISummaryStat {
        playingTimes: number
        avgClickTimes: number
        minClickTimes: number
        maxClickTimes: number
    }
    
    export interface IGlobalSummaryStat extends ISummaryStat {
        players: number
    }

    export interface IMinStat {
        myMinClickTimes: number
        globalMinClickTimes: number
    }

    export interface IUserRank {
        userId: string
        minClickTimes: number
    }
}


