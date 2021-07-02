
export const getGameList = async (): Promise<IGame[]> => {

    return []
}

export const getMyGameMatchSession = async (): Promise<IGameMatchSession> => {
    return {
        matchId: 2,
        gameId: "",
    }
}

interface IGameMatchSession {
    matchId: number
    gameId: string
}

interface IGame {
    id: string
    name: string
    imageUrl: string
}
