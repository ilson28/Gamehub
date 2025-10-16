import { MdPersonOutline } from "react-icons/md"
import Modal from "../modal/Modal"
import { IoCartOutline } from "react-icons/io5"
import { CgGames } from "react-icons/cg";


const CartModalGame = () => {


    return (

        <Modal>
            <div className="h-5/6 w-4/5 max-w-xl bg-white rounded-lg shadow-lg overflow-y-auto">
                <div className="text-2xl font-bold text-white p-5 bg-blue-600">
                    <h2>Confirmar Transacción</h2>
                </div>
                <div className="p-5 bg-gray-100 rounded-md m-6">
                    <div className="w-4/5">

                        <div className="flex items-center gap-3 mb-5">
                            <MdPersonOutline className="text-3xl text-blue-500" />
                            <h3 className="text-2xl font-semibold text-gray-900">Información del Cliente</h3>
                        </div>

                        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <span className="text-gray-600">Cédula</span>
                                    <span className="font-medium text-gray-900 text-xl">1001780747</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600">Telefono</span>
                                    <span className="font-medium text-gray-900 text-xl">1001780747</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <span className="text-gray-600">Nombre</span>
                                    <span className="font-medium text-gray-900 text-xl">1001780747</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-600">Direccion</span>
                                    <span className="font-medium text-gray-900 text-xl">1001780747</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex gap-2 p-5 m-6 rounded-md bg-blue-50">
                    <div className="bg-blue-600 rounded-full p-3 text-white">
                        <IoCartOutline className="text-3xl" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-600">Tipo de Transaccion</span>
                        <span className="font-bold text-blue-800 text-xl">Venta</span>
                    </div>
                </div>
                <div className="p-5 m-6">
                    <div className="flex gap-2 items-center mb-5">
                        <CgGames className="text-2xl font-bold text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-900" s>Videojuegos</h3>
                    </div>

                    <div className="max-h-60 overflow-y-auto flex flex-col gap-3">
                        <div className="flex flex-col md:flex-row md:justify-between text-gray-500 border border-gray-200 shadow-xl rounded-lg p-3">

                            <div className="flex flex-col ">
                                <span>titulo</span>
                                <span>nintendo</span>
                                <span>cantidad: </span>
                            </div>
                            <div className="mt-3 flex justify-between">
                                <span className="md:opacity-0">subtotal</span>
                                <span className="text-gray-900 font-extrabold">10000</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </Modal>)
}

export default CartModalGame