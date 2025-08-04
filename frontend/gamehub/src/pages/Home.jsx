import { IoGameControllerOutline } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { SlReload } from "react-icons/sl";
import { RiHistoryFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";

import Cards from "../components/Card";

const Home = () => {

    return (
        <div className='container'>

            <div className='flex flex-col gap-3 my-4'>
                <h2 className='text-3xl font-bold text-gray-900'>Gestión de Videojuegos</h2>
                <p className='text-gray-600'>Administra tu inventario de videojuegos, ventas y alquileres</p>
            </div>

            <div className='my-4 flex flex-col md:flex-row gap-4 '>

                <div className='flex items-center gap-3 shadow-lg bg-white rounded-lg p-6 grow'>
                    <div className="text-2xl p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <IoGameControllerOutline />
                    </div>

                    <div className="flex flex-col ">
                        <span className="text-gray-600">Total juegos</span>
                        <span className="font-bold text-2xl">6</span>
                    </div>
                </div>
                <div className='flex items-center gap-3 shadow-lg bg-white rounded-lg p-6 grow'>
                    <div className="text-2xl p-2 bg-green-100 text-green-600 rounded-lg">
                        <FaCartShopping />
                    </div>

                    <div className="flex flex-col ">
                        <span className="text-gray-600">Ventas hoy</span>
                        <span className="font-bold text-2xl">6</span>
                    </div>
                </div>
                <div className='flex items-center gap-3 shadow-lg bg-white rounded-lg p-6 grow'>
                    <div className="text-2xl p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <SlReload />
                    </div>

                    <div className="flex flex-col ">
                        <span className="text-gray-600">Alquileres Activos</span>
                        <span className="font-bold text-2xl">6</span>
                    </div>
                </div>
                <div className='flex items-center gap-3 shadow-lg bg-white rounded-lg p-6 grow'>
                    <div className="text-2xl p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <RiHistoryFill />
                    </div>

                    <div className="flex flex-col ">
                        <span className="text-gray-600">Stock Total</span>
                        <span className="font-bold text-2xl">6</span>
                    </div>
                </div>

            </div>

            <div className="my-4 text-gray-500 relative">
                <input
                    className="w-full h-full py-4 px-9 rounded-lg shadow-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    type="text"
                    placeholder="Busca un videojuego por titulo o genero" />
                <CiSearch size={22} className=" absolute top-1/2 -translate-y-1/2 left-2" />
            </div>

            <Cards />

        </div>
    )
}

export default Home