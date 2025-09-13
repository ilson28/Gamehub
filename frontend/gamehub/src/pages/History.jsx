import { clsx } from "clsx";
import { twMerge } from 'tailwind-merge'
import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6"
import { IoCart, IoTimeSharp } from "react-icons/io5";



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

            <div className="p-6 flex flex-col gap-5 rounded-lg bg-white">

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

                        <div className="flex items-center gap-3 text-black font-semibold">
                            <FaCartShopping color="blue" />
                            <span>Historial de Ventas</span>
                        </div>

                        :

                        <div className="flex items-center gap-3 text-black font-semibold">
                            <IoTimeSharp color="blue" />
                            <span>Historial de Alquileres</span>
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

                <div className="overflow-x-auto">
                    <table className="w-full text-left">

                        <thead className="bg-gray-100 text-gray-500 ">
                            <tr>
                                <th className="pl-8">Fecha y Hora </th>
                                <th>Cédula Cliente</th>
                                <th>Tipo</th>
                                <th>Total</th>
                                <th>Fecha Devolución</th>

                                {tabActive === "rent" &&
                                    <th>Estado</th>
                                }
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>
                                    <div className="flex flex-col gap-1 pl-8 text-sm">
                                        <span>13/07/2025</span>
                                        <span className="text-gray-500">16:20</span>
                                    </div>
                                </td>
                                <td>11223344</td>
                                <td>
                                    <div className={clsx("flex items-center gap-1 w-min px-2 py-0.5 text-xs font-medium rounded-xl",
                                        tabActive === "sale" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"

                                    )}>
                                        {
                                            tabActive === "sale" ?
                                                <IoCart size={18} />
                                                :
                                                <IoTimeSharp size={18} />}
                                        alquiler
                                    </div>
                                </td>
                                <td>$15.000</td>
                                <td>20/07/2025</td>
                                {
                                    tabActive === "rent" &&
                                    <td>
                                        <div className="flex items-center gap-1 w-min px-2 py-0.5 bg-yellow-100 text-xs text-yellow-800 font-medium rounded-xl">
                                            <IoTimeSharp size={18} />
                                            activo
                                        </div>
                                    </td>}
                                <td></td>
                            </tr>



                        </tbody>

                    </table>
                </div>

            </div>

        </div >
    )
}

export default History