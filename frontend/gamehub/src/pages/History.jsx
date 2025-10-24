import { clsx } from "clsx";
import { twMerge } from 'tailwind-merge'
import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6"
import { IoCart, IoEyeSharp, IoTimeSharp } from "react-icons/io5";

import { getRentalTransactions, getTransactionsForType } from "../services/transaccionService"
import { useQuery } from "@tanstack/react-query";
import useModalContext from "../hooks/useModalContext";
import TransactionModalGame from "../components/TransactionModalGame";


const History = () => {


    const [tabActive, setTabActive] = useState("venta");
    const [rentalFilter, setRentalFilter] = useState("all");
    const [transaction, setTransaction] = useState(null);
    const { state, setState } = useModalContext();
    const { isLoading, isError, data: transactions = [] } = useQuery({
        queryKey: ['transactions', tabActive, rentalFilter],
        queryFn: () => {
            if (tabActive === "venta" || rentalFilter === "all") {
                return getTransactionsForType(tabActive);
            }
            return getRentalTransactions(rentalFilter);
        },
        select: (response) => response.success ? response.data : [],
        staleTime: 1000 * 60 * 60 * 2 // 2 horas

    })

    const handleTab = tab => tab === "venta" ? setTabActive("venta") : setTabActive("alquiler");




    return (
        <div className="container overflow-x-auto">

            <div className="my-6 flex flex-col gap-3">
                <h2 className="text-3xl font-bold">Historial de Transacciones</h2>
                <span className="text-gray-600">Consulta el historial completo de ventas y alquileres</span>
            </div>

            <div className="p-6 flex flex-col gap-5 rounded-lg bg-white">

                <div className="flex gap-10  border-b border-gray-200">

                    <div
                        onClick={e => handleTab("venta")}
                        className={twMerge(clsx(
                            "flex items-center gap-2 pb-2 text-gray-600 cursor-pointer",
                            {
                                "border-b-2 border-blue-700 text-blue-800": tabActive === "venta"
                            }

                        ))}>
                        <FaCartShopping />
                        <span>Ventas</span>
                    </div>
                    <div
                        onClick={e => handleTab("alquiler")}
                        className={twMerge(clsx(
                            "flex items-center gap-2 pb-2 text-gray-600 cursor-pointer",
                            {
                                "border-b-2 border-blue-700 text-blue-800": tabActive === "alquiler"
                            }

                        ))}>
                        <IoTimeSharp />
                        <span>Alquileres</span>
                    </div>

                </div>

                <div className="flex">

                    {tabActive === "venta" ?

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
                            tabActive === "alquiler" &&
                            <select

                                defaultValue={"all"}
                                onChange={e => setRentalFilter(e.target.value)}
                                name="rentFilter"
                                className="p-2 outline-none focus:border-blue-800 rounded-md focus:border-2 border border-gray-300">
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
                                <th className="pl-8">Fecha y Hora</th>
                                <th>Cédula Cliente</th>
                                <th>Tipo</th>
                                <th>Total</th>
                                {tabActive === "alquiler" &&
                                    <th>Fecha Devolución</th>}

                                {tabActive === "alquiler" &&
                                    <th>Estado</th>
                                }
                                <th>Acciones</th>
                            </tr>
                        </thead>


                        {
                            !isLoading &&
                            <tbody>
                                {
                                    transactions.map(transaction =>
                                        <tr key={transaction.id} >
                                            <td>
                                                <div className="flex flex-col gap-1 pl-8 text-sm">
                                                    <span>{transaction.fechaTrans}</span>
                                                    <span className="text-gray-500">{transaction.hora.slice(0, 5)}</span>
                                                </div>
                                            </td>
                                            <td>{transaction.cliente.cedula}</td>
                                            <td>
                                                <div className={clsx("flex items-center gap-1 w-min px-2 py-0.5 text-xs font-medium rounded-xl",
                                                    tabActive === "venta" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"

                                                )}>
                                                    {
                                                        tabActive === "venta" ?
                                                            <IoCart size={18} />
                                                            :
                                                            <IoTimeSharp size={18} />}
                                                    {transaction.tipo}
                                                </div>
                                            </td>
                                            <td>${transaction.total}</td>
                                            {tabActive === "alquiler" &&
                                                <td>{transaction.fechaDev}</td>
                                            }
                                            {
                                                tabActive === "alquiler" &&
                                                <td>
                                                    <div className="flex items-center gap-1 w-min px-2 py-0.5 bg-yellow-100 text-xs text-yellow-800 font-medium rounded-xl">
                                                        <IoTimeSharp size={18} />
                                                        {transaction.estado}
                                                    </div>
                                                </td>}
                                            <td className="cursor-pointer">
                                                <IoEyeSharp
                                                    onClick={e => {
                                                        setTransaction(transaction);
                                                        setState(true);
                                                    }}
                                                    className="text-blue-600 text-2xl text-center" />
                                            </td>
                                        </tr>)
                                }

                            </tbody>

                        }

                    </table>
                    {
                        isLoading &&
                        <div className="container mt-10 flex justify-center items-center flex-col gap-4 text-gray-600">
                            <div className="text-6xl animate-spin">
                                🎮
                            </div>
                            <p className="text-xl font-semibold after:content-[''] after:animate-dots">Cargando</p>

                        </div>
                    }

                </div>

            </div>

            {
                transaction &&
                <TransactionModalGame
                    cliente={transaction.cliente}
                    Onclose={() => setState(false)}
                    transaction={transaction}
                    cart={false}
                />
            }

        </div >
    )
}

export default History