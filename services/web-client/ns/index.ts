import axios, { AxiosInstance } from "axios"
export namespace NSGameMatchingCards {

    const isServer = typeof window == 'undefined'

    let axiosInstance: AxiosInstance = axios.create({ 
        baseURL: isServer ? process.env.BASE_GAME_MATCHING_CARDS_URL_SSR : process.env.BASE_GAME_MATCHING_CARDS_URL
    })


    export const setUserId = (userId?: string) => {
        if (userId) {
            axiosInstance.defaults.headers["User-ID"] = userId
            return
        }

        delete axiosInstance.defaults.headers["User-ID"]
    }

    export const createMatch = async (): Promise<IMatch> => {
        try {
            const response = await axiosInstance.post("/")
            return {
                matchId: response.data.match_id
            }

        } catch (error) {
            throw Error("Create match error")
        }
    }

    export const getMatchSessionState = async (matchId: string): Promise<IGameMatchingCardsSessionState> => {

        try {
            const response = await axiosInstance.get("/" + matchId)
            let matchSession: IGameMatchingCardsSessionState = {
                matchId: response.data.match_id,
                clickTimes: response.data.click_times,
                previousPickupCard: <ICard>response.data.previous_pickup_card,
                activatedCards: <ICard[]>response.data.activated_cards,
            }

            return matchSession

        } catch (error) {
            throw Error("get match session error")
        }
    }

    export const clickCard = async (matchId: string, position: number): Promise<IClickCardResult> => {
        try {
            const response = await axiosInstance.post("/pick-card", { match_id: matchId, position, })
            return {
                cardNumber: response.data.card_number
            }

        } catch (error) {
            throw Error("pick card error")
        }
    }

    export const getCurrentMatch = async (): Promise<ICurrentMatch> => {
        try {
            const response = await axiosInstance.get("/current-match")
            return {
                matchId: response.data.match_id
            }

        } catch (error) {
            throw Error("pick card error")
        }
    }

    export const getMinStat = async (): Promise<IMinStat> => {
        try {
            const response = await axiosInstance.get("/summary/min-click-times")
            return {
                globalMinClickTimes: response.data?.global_min_click_times || 0,
                myMinClickTimes: response.data?.user_min_click_times || 0,
            }

        } catch (error) {
            throw Error("get min stat error")
        }
    }

    export const getTop10UserRanks = async (): Promise<IUserRank[]> => {
        try {
            const response = await axiosInstance.get("/summary/ranks")
            const ranks: IUserRank[] = []

            response.data?.map?.((d: any) => ranks.push({ userId: d.user_id || '-', minClickTimes: d.min_click_times || 0 }))
            return ranks

        } catch (error) {
            throw Error("get top 10 user ranks error")
        }
    }


    export interface IMatch {
        matchId: number
    }

    export interface ICurrentMatch {
        matchId: number
    }
    export interface IClickCardResult {
        cardNumber: number
        // isMatched?: boolean | null
    }

    export interface ICard {
        position: number
        number: number
        isActivated?: boolean
    }

    export interface IGameMatchingCardsSessionState {
        matchId: string
        clickTimes: number
        previousPickupCard: ICard
        activatedCards: ICard[]
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


