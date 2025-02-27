import { PropsWithChildren } from "react"

const Loader = ({
    height = "h-32",
    width = "w-32"
}: PropsWithChildren<{
    height?: string;
    width?: string;
}>) => {
    return (
        <div className="absolute top-0 left-0 z-50 w-full h-full bg-gray-200 bg-opacity-50 flex items-center justify-center">
            <div className={`animate-spin rounded-full ${height} ${width} border-t-4 border-b-4 border-red-500`}></div>
        </div>
    )
}

export default Loader