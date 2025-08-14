import { IoGameControllerOutline } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { SlReload } from "react-icons/sl";
import { RiHistoryFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";

import Cards from "../components/Card";
import { getTotalGames } from "../services/videojuegoService";
import { getTotalActiveTransaccions, getTotalSalesToday } from "../services/transaccionService";
import { VscLoading } from "react-icons/vsc";

import { useQuery } from "@tanstack/react-query";

const Home = () => {

    //  Total de juegos
    const { data: totalGames = 0, isLoading: loadingGames } = useQuery({
        queryKey: ['totalGames'],
        queryFn: getTotalGames,
        select: (res) => res.data // simplifica acceso
    });

    // Ventas de hoy
    const { data: totalSales = 0, isLoading: loadingSales } = useQuery({
        queryKey: ['totalSalesToday'],
        queryFn: getTotalSalesToday,
        select: (res) => res.data
    });

    //  Alquileres activos
    const { data: totalRentals = 0, isLoading: loadingRentals } = useQuery({
        queryKey: ['totalActiveRentals'],
        queryFn: getTotalActiveTransaccions,
        select: (res) => res.data
    });



    //Forma antigüa de hacer peticiones a la API usando el hook useApiRequest

    // const { sendRequest, loading, error, clearError } = useApiRequest();
    // const [totalGames, setTotalGames] = useState(0);
    // const [totalSales, setTotalSales] = useState(0);
    // const [totalRentals, setTotalRentals] = useState(0);

    // const fetchData = async () => {

    //     const totalGamesResponse = await sendRequest(() => getTotalGames());
    //     setTotalGames(totalGamesResponse.data);

    //     const totalSalesResponse = await sendRequest(() => getTotalSalesToday());
    //     setTotalSales(totalSalesResponse.data);

    //     const totalRentalsResponse = await sendRequest(() => getTotalActiveTransaccions());
    //     setTotalRentals(totalRentalsResponse.data);

    // }

    // useEffect(() => {

    //     fetchData();
    //     return () => clearError();

    // }, []);

    return (
        <div className='container'>

            {/* Encabezado */}
            <div className='flex flex-col gap-3 my-4'>
                <h2 className='text-3xl font-bold text-gray-900'>Gestión de Videojuegos</h2>
                <p className='text-gray-600'>Administra tu inventario de videojuegos, ventas y alquileres</p>
            </div>

            {/* Tarjetas */}
            <div className='my-4 flex flex-col md:flex-row gap-4 '>

                {/* Total juegos */}
                <div className='flex items-center gap-3 shadow-lg bg-white rounded-lg p-6 grow'>
                    <div className="text-2xl p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <IoGameControllerOutline />
                    </div>

                    <div className="flex flex-col ">
                        <span className="text-gray-600">Total juegos</span>

                        {
                            loadingGames ? (
                                <div className="flex justify-center items-center">
                                    <VscLoading className="animate-spin text-2xl" />
                                </div>
                            ) : (
                                <span className="font-bold text-2xl">{totalGames}</span>
                            )
                        }
                    </div>
                </div>

                {/* Ventas hoy */}
                <div className='flex items-center gap-3 shadow-lg bg-white rounded-lg p-6 grow'>
                    <div className="text-2xl p-2 bg-green-100 text-green-600 rounded-lg">
                        <FaCartShopping />
                    </div>

                    <div className="flex flex-col ">
                        <span className="text-gray-600">Ventas hoy</span>

                        {
                            loadingSales ? (
                                <div className="flex justify-center items-center">
                                    <VscLoading className="animate-spin text-2xl" />
                                </div>
                            ) : (
                                <span className="font-bold text-2xl">{totalSales}</span>
                            )
                        }

                    </div>
                </div>

                {/* Alquileres activos */}
                <div className='flex items-center gap-3 shadow-lg bg-white rounded-lg p-6 grow'>
                    <div className="text-2xl p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <SlReload />
                    </div>

                    <div className="flex flex-col ">
                        <span className="text-gray-600">Alquileres Activos</span>
                        {
                            loadingRentals ? (
                                <div className="flex justify-center items-center">
                                    <VscLoading className="animate-spin text-2xl" />
                                </div>
                            ) : (
                                <span className="font-bold text-2xl">{totalRentals}</span>
                            )
                        }
                    </div>
                </div>
                {/* Stock total */}
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
            {/* Buscador */}
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