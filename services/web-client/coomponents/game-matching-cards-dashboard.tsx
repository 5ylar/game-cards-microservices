import { NSGameMatchingCards } from "../ns";

export default function GameMatchingCardsDashboard(props: IProps) {
    return (
        <div className="p-4">
            <div className="grid md:grid-cols-2 gap-2 mb-2">
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="font-bold mb-2 text-center text-2xl">My Best</h2>
                    <p className="text-center text-2xl">{props.mySummaryState.minClickTimes}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="font-bold mb-2 text-center text-2xl">Global Best</h2>
                    <p className="text-center text-2xl">{props.globalSummaryStat.minClickTimes}</p>
                </div>
            </div>
            {
                props.top10UserRanks.length > 0 && (
                    <div className="w-9/12 mx-auto mt-6">
                        <h2 className="font-bold mb-2 text-center text-3xl">Ranks</h2>
                        <div className="bg-gray-100 p-4 w-full rounded">
                            <table className="table w-full">
                                <thead>
                                    <th>User</th>
                                    <th>Best</th>
                                </thead>
                                <tbody>
                                    {
                                        props.top10UserRanks.map((v, i) => (
                                            <tr key={i}>
                                                <td className="text-center">{v.userId}</td>
                                                <td className="text-center">{v.minClickTimes}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div>
    )
}


interface IProps {
    top10UserRanks: NSGameMatchingCards.IUserRank[]
    mySummaryState: NSGameMatchingCards.ISummaryStat
    globalSummaryStat: NSGameMatchingCards.IGlobalSummaryStat
}
