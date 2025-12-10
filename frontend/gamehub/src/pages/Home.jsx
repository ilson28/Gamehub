import { IoGameControllerOutline } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { SlReload } from "react-icons/sl";
import { RiHistoryFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";

import Cards from "../components/Card";
import { getGames, getTotalGames, getTotalStock } from "../services/videojuegoService";
import { getTotalActiveTransaccions, getTotalSalesToday } from "../services/transaccionService";


import { useQuery } from "@tanstack/react-query";
import ItemCard from "../components/ItemCard";

const Home = () => {


    // Usamos React Query para manejar la petición a la API de videojuegos
    // Esto nos permite manejar el estado de carga, error y datos de manera más eficiente
    const { data: games = [], isLoading, isError, error } = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
        select: (response) => response.success ? response.data : [],
        staleTime: 1000 * 60 * 60 * 24 // 24 horas

    })

    //  Total de juegos
    const { data: totalGames = 0, isLoading: loadingGames } = useQuery({
        queryKey: ['totalGames'],
        queryFn: getTotalGames,
        select: (res) => res.data, // simplifica acceso
        staleTime: 1000 * 60 * 60 * 2 // 2 horas

    });

    // Ventas de hoy
    const { data: totalSales = 0, isLoading: loadingSales } = useQuery({
        queryKey: ['totalSalesToday'],
        queryFn: getTotalSalesToday,
        select: (res) => res.data,
        staleTime: 1000 * 60 * 60 * 2 // 2 horas


    });

    //  Alquileres activos
    const { data: totalRentals = 0, isLoading: loadingRentals } = useQuery({
        queryKey: ['totalActiveRentals'],
        queryFn: getTotalActiveTransaccions,
        select: (res) => res.data,
        staleTime: 1000 * 60 * 60 * 2 // 2 horas

    });

    //  Stock total
    const { data: totalStock = 0, isLoading: loadingStock } = useQuery({

        queryKey: ['totalStock'],
        queryFn: getTotalStock,
        select: (res) => res.data,
        staleTime: 1000 * 60 * 60 * 2 // 2 horas
    })



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
            <div className='my-4 flex flex-col md:flex-row gap-4'>

                {/* Total juegos */}
                <ItemCard
                    icon={<IoGameControllerOutline />}
                    text="Total juegos"
                    loading={loadingGames}
                    value={totalGames}
                />

                {/* Ventas hoy */}
                <ItemCard
                    icon={<FaCartShopping />}
                    text="Ventas hoy"
                    loading={loadingSales}
                    value={totalSales}
                    color="green"
                />

                {/* Alquileres activos */}
                <ItemCard
                    icon={<SlReload />}
                    text="Alquileres Activos"
                    loading={loadingRentals}
                    value={totalRentals}
                    color="orange"
                />

                {/* Stock total */}
                <ItemCard
                    icon={<RiHistoryFill />}
                    text="Stock Total"
                    loading={loadingStock}
                    value={totalStock}
                    color="purple"
                />
            </div>
            {/* Buscador */}
            <div className="my-4 text-gray-500 relative">
                <input
                    className="w-full h-full py-4 px-9 rounded-lg shadow-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    type="text"
                    placeholder="Busca un videojuego por titulo o genero" />
                <CiSearch size={22} className="absolute top-1/2 -translate-y-1/2 left-2" />
            </div>

            <Cards
                games={games}
                isLoading={isLoading}
                isError={isError}
                error={error}
            />

        </div>
    )
}

export default Home