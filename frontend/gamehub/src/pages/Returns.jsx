import { BsArrow90DegLeft } from "react-icons/bs";
import { CiCalendarDate, CiSearch } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { PiArrowCounterClockwiseFill } from "react-icons/pi";
import { LuFilter } from "react-icons/lu";
import ItemCard from "../components/ItemCard";
import { FaCircleCheck } from "react-icons/fa6";
import { IoEyeSharp, IoTimeSharp } from "react-icons/io5";
import ButtonCard from "../components/ButtonCard";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useModalContext from "../hooks/useModalContext";
import TransactionModalGame from "../components/TransactionModalGame";
import { getAll } from "../services/registroDevolucionService";
import { getReturnsOfMonth, getReturnsOfToday, getTotalReturns } from "../services/registroDevolucionService";
import clsx from "clsx";


const Returns = () => {

    const [transaccion, setTransaccion] = useState(null);
    const { setState } = useModalContext();
    const [cliente, setCliente] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [actualPage, setActualPage] = useState(0);

    const { isLoading, data, isError } = useQuery({
        queryKey: ['returns', cliente, startDate, endDate, actualPage],
        queryFn: () => getAll(parseInt(cedula, 10), startDate, endDate, actualPage),
        staleTime: 1000 * 60 * 60 * 2, // 2 horas

    })

    //total de devoluciones
    const { data: totalReturns, isLoading: totalReturnsLoading } = useQuery({
        queryKey: ['totalReturns'],
        queryFn: getTotalReturns,
        staleTime: 1000 * 60 * 60 * 2, // 2 horas
    });

    // devoluciones del mes
    const { data: returnsOfMonth, isLoading: returnsOfMonthLoading } = useQuery({
        queryKey: ['returnsOfMonth'],
        queryFn: getReturnsOfMonth,
        staleTime: 1000 * 60 * 60 * 2, // 2 horas
    }
    );

    // devoluciones del dia
    const { data: returnsOfToday, isLoading: returnsOfTodayLoading } = useQuery({
        queryKey: ['returnsOfToday'],
        queryFn: getReturnsOfToday,
        staleTime: 1000 * 60 * 60 * 2, // 2 horas
    }
    );


    // console.log(data);

    const totalPages = data ? data.totalPages : 0;
    const pages = [...Array(totalPages).keys()];


    const scrollRef = useRef(null);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({
            left: -34,
            behavior: 'smooth'
        });
    }
    const scrollRight = () => {
        scrollRef.current.scrollBy({
            left: 34,
            behavior: 'smooth'
        });
    }
    const getCurrentDate = () => {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return today.toLocaleDateString(undefined, options);
    }


    return (
        <div className="container">
            {/* Encabezado de la pagina */}
            <div className="flex justify-between flex-wrap bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="text-2xl p-2 rounded-lg bg-blue-100 text-blue-600">
                        <BsArrow90DegLeft />
                    </div>
                    <h1 className="font-bold text-gray-800 text-2xl md:text-3xl" >Devoluciones</h1>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                    <CiCalendarDate size={25} />
                    <p className="text-md md:text-xl">
                        {getCurrentDate()}
                    </p>
                </div>
            </div>

            {/* Cards */}
            <div className='bg-white rounded-xl my-8 flex flex-col md:flex-row gap-4'>
                <ItemCard
                    icon={<PiArrowCounterClockwiseFill />}
                    text="Total Devoluciones"
                    loading={totalReturnsLoading}
                    value={totalReturns || 0}
                />
                <ItemCard
                    icon={<FaCircleCheck />}
                    text="Este Mes"
                    loading={returnsOfMonthLoading}
                    value={returnsOfMonth || 0}
                    color="green"
                />
                <ItemCard
                    icon={<IoTimeSharp />}
                    text="Hoy"
                    loading={returnsOfTodayLoading}
                    value={returnsOfToday || 0}
                    color="purple"
                />
            </div>

            {/* Busqueda */}
            <div className="flex flex-col gap-4 text-gray-700 bg-white p-6 border border-gray-200 rounded-xl md:flex-row">

                <div className="flex flex-col gap-1 md:flex-1">
                    <label htmlFor="cedula">Buscar cliente</label>
                    <div id="cedula" className="relative text-gray-500">
                        <input
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            className="w-full h-full py-3 px-9 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            type="text"
                            placeholder="Cédula" />
                        <CiSearch size={22} className="absolute top-1/2 -translate-y-1/2 left-2" />
                    </div>
                </div>
                <div className="flex flex-col gap-1 md:flex-1">
                    <label htmlFor="startDate">Fecha Desde</label>
                    <input
                        onChange={(e) => setStartDate(e.target.value)}
                        id="startDate"
                        className="py-3 px-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        type="date"
                        placeholder="dd/mm/aaaa" />

                </div>
                <div className="flex flex-col gap-1 md:flex-1">
                    <label htmlFor="endDate">Fecha Desde</label>
                    <input
                        onChange={(e) => setEndDate(e.target.value)}
                        id="endDate"
                        className="py-3 px-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        type="date"
                        placeholder="dd/mm/aaaa" />

                </div>
                <ButtonCard
                    className="flex gap-2 justify-center items-center text-xl md:self-end md:flex-1"
                    color="blue"
                >
                    <LuFilter size={21} />
                    Filtrar

                </ButtonCard>
            </div>

            {/* Contenedor de la Tabla */}
            {!isLoading && data?.totalPages > 0 && <div className="my-8 bg-white rounded-xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">

                    {/* Tabla */}
                    <table className="w-full min-w-xl text-left">
                        <thead>
                            <tr className="bg-gray-100 text-gray-500 uppercase text-sm leading-normal">
                                <th className="pl-6">Cédula</th>
                                <th>Cliente</th>
                                <th>Alquiler</th>
                                <th>Devolucion</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                data.content.map(dev => (
                                    <tr key={dev.id}>
                                        <td className="pl-6">{dev.transaccion.cliente.cedula}</td>
                                        <td>{`${dev.transaccion.cliente.nombre} ${dev.transaccion.cliente.apellido}`}</td>
                                        <td>{dev.transaccion.fechaTrans}</td>
                                        <td>{dev.fecha}</td>
                                        <td
                                            onClick={() => {
                                                setTransaccion(dev.transaccion);
                                                setState('returnDetailsModal', true)
                                            }}
                                            className="cursor-pointer flex justify-center">
                                            <IoEyeSharp className="text-blue-600 text-2xl" />
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>



                    </table>

                    {/* Paginacion */}
                    <div className="flex items-center justify-between text-gray-500 py-3 px-6">
                        <div>
                            <p>Mostrando 1-10 de {data.totalElements} resultados</p>
                        </div>
                        <div className="flex gap-1 ">
                            <button
                                disabled={data.first}
                                onClick={scrollLeft}
                                className="flex items-center justify-center w-11 py-1 rounded-lg border border-gray-300 cursor-pointer 
                                disabled:opacity-50  disabled:cursor-not-allowed">
                                <IoIosArrowBack size={16} />
                            </button>
                            <div
                                ref={scrollRef}
                                className="flex gap-1 scroll-smooth overflow-x-hidden w-27">

                                {
                                    pages.map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setActualPage(num)}
                                            className={clsx("flex items-center justify-center min-w-8 py-1 border rounded-lg border-gray-300",
                                                actualPage === num && "bg-blue-500 text-white font-bold"
                                            )}>
                                            {num + 1}
                                        </button>
                                    ))
                                }

                            </div>
                            <button
                                disabled={data.last}
                                onClick={scrollRight}
                                className="flex items-center justify-center w-11 py-1 rounded-lg border border-gray-300 cursor-pointer 
                                disabled:opacity-50  disabled:cursor-not-allowed">
                                <IoIosArrowForward size={16} />
                            </button>
                        </div>

                    </div>

                </div>

            </div>}
            {
                // Loading State
                isLoading &&
                <div className="container mt-10 flex justify-center items-center flex-col gap-4 text-gray-600">
                    <div className="text-6xl animate-spin">
                        🎮
                    </div>
                    <p className="text-xl font-semibold after:content-[''] after:animate-dots">Cargando</p>

                </div>
            }

            {
                !isLoading && data?.totalPages == 0 &&
                <div className="container mt-10 flex justify-center items-center flex-col gap-4 text-gray-600">
                    <div className="text-6xl">
                        👻
                    </div>
                    <p className="text-xl font-semibold">Nada por aquí</p>
                    <p>El registro de devoluciones esta vacio!</p>
                </div>
            }
            {
                transaccion &&
                <TransactionModalGame
                    transaction={transaccion}

                />
            }


        </div>
    )
}

export default Returns