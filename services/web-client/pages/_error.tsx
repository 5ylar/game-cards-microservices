import { NextPageContext } from "next"

function Error(props: any) {
    return <div className="py-32">
        <h1 className="text-4xl text-center font-bold">
            {
                props.statusCode == 404 ? "Page Not Found" : "Internal Server Error"
            }
        </h1>
    </div>
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error