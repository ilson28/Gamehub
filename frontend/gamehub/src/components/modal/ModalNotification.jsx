import clsx from "clsx"
import { FaCheckCircle } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
const ModalNotification = ({ error, title, body, show }) => {

    return (
        <div className={clsx("max-w-96 flex flex-col gap-4 fixed right-4 z-50 rounded-md shadow-xl bg-white p-4 border-l-2",
            "transition-all duration-500 ease-in-out",
            error ? "border-red-500" : "border-green-500",
            show ? "translate-x-0 opacity-full" : "translate-x-[calc(100%+1rem)] opacity-0"
        )}>

            <div className="flex gap-2">
                <div className="text-4xl min-w-9">

                    {
                        error ?
                            <GiCancel className="text-red-500 bg-red-50" />
                            :
                            <FaCheckCircle className="text-green-500 bg-red-50" />
                    }
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className={clsx(error ? "text-red-700" : "text-green-700")}>{title}</h2>
                    <p className="text-gray-500">{body}</p>
                </div>
            </div>
            <div className={clsx("h-1 rounded-md",
                show && "animate-progress",
                error ? "bg-red-500" : "bg-green-500")}>

            </div>
        </div >
    )
}

export default ModalNotification