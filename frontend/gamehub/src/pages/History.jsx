import { clsx } from "clsx";
import { twMerge } from 'tailwind-merge'
import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6"
import { IoTimeSharp } from "react-icons/io5";



const History = () => {


    const [tabActive, setTabActive] = useState("sale")

    const handleTab = (tab) => {

        tab === "sale" ? setTabActive("sale") : setTabActive("rent")

    }

    return (
        <div className="container overflow-x-auto">

            <div className="my-6 flex flex-col gap-3">
                <h2 className="text-3xl font-bold">Historial de Transacciones</h2>
                <span className="text-gray-600">Consulta el historial completo de ventas y alquileres</span>
            </div>

            <div className="p-6 flex flex-col gap-8 rounded-lg bg-white">

                <div className="flex gap-10  border-b border-gray-200">

                    <div
                        onClick={e => handleTab("sale")}
                        className={twMerge(clsx(
                            "flex items-center gap-2 pb-2 text-gray-600 cursor-pointer",
                            {
                                "border-b-2 border-blue-700 text-blue-800": tabActive === "sale"
                            }

                        ))}>
                        <FaCartShopping />
                        <span>Ventas</span>
                    </div>
                    <div
                        onClick={e => handleTab("rent")}
                        className={twMerge(clsx(
                            "flex items-center gap-2 pb-2 text-gray-600 cursor-pointer",
                            {
                                "border-b-2 border-blue-700 text-blue-800": tabActive === "rent"
                            }

                        ))}>
                        <IoTimeSharp />
                        <span>Alquileres</span>
                    </div>

                </div>

                <div className="flex">

                    {tabActive === "sale" ?

                        <div className="flex items-center gap-3 text-blue-700">
                            <FaCartShopping />
                            <span>Historial de Ventas</span>
                        </div>

                        :

                        <div className="flex items-center gap-3 text-blue-700">
                            <IoTimeSharp />
                            <span>Historial de Ventas</span>
                        </div>

                    }

                    <div className="ml-auto flex gap-3">

                        {
                            tabActive === "rent" &&
                            <select name="rentFilter" className="p-2 outline-none focus:border-blue-800 rounded-md focus:border-2 border border-gray-300">
                                <option value="all">Todos los alquileres</option>
                                <option value="actives">Alquileres Activos</option>
                                <option value="returns">Alquileres devueltos</option>
                            </select>
                        }
                        <input
                            type="date"
                            className="p-2 outline-none focus:border-blue-800 rounded-md focus:border-2 border border-gray-300" />


                    </div>
                </div>
            </div>

        </div >
    )
}

export default History