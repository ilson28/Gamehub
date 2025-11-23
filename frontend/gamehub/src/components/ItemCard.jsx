import { VscLoading } from "react-icons/vsc";
const ItemCard = ({ icon, text, loading, value }) => {
    return (
        <div className='flex items-center gap-3 shadow-lg bg-white rounded-lg p-6 grow'>
            <div className="text-2xl p-2 bg-blue-100 text-blue-600 rounded-lg">
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