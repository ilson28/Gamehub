import clsx from "clsx";
import { VscLoading } from "react-icons/vsc";
import { twMerge } from "tailwind-merge";

const colors = {

    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
}


const ItemCard = ({ icon, text, loading, value, color }) => {
    return (
        <div className='flex items-center gap-3 shadow-lg bg-white rounded-lg p-6 grow'>
            <div className={twMerge(clsx(
                "text-2xl p-2 rounded-lg",
                colors.blue,
                colors[color]
            ))}>
                {icon}
            </div>

            <div className="flex flex-col ">
                <span className="text-gray-600">{text}</span>

                {
                    loading ? (
                        <div className="flex justify-center items-center">
                            <VscLoading className="animate-spin text-2xl" />
                        </div>
                    ) : (
                        <span className="font-bold text-2xl">{value}</span>
                    )
                }
            </div>
        </div>
    )
}

export default ItemCard