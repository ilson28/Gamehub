import Videojuego from "./Videojuego"

import { getGames } from "../services/videojuegoService";

import { useQuery } from "@tanstack/react-query"; // Importamos React Query


const Cards = () => {

    // Usamos React Query para manejar la petición a la API de videojuegos
    // Esto nos permite manejar el estado de carga, error y datos de manera más eficiente
    const { data: videojuegos = [], isLoading, isError, error } = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
        select: (response) => response.success ? response.data : [],
        staleTime: 1000 * 60 * 60 * 24 // 24 horas

    })

    // forma anterior de realizar la petición a la API para  obtener los videojuegos, ahora se usa React Query 
    // const { loading, error, sendRequest } = useApiRequest();
    // const [videojuegos, setVideojuegos] = useState([]);
    // const fetchData = async () => {

    //     // Llamada a la API para obtener los videojuegos
    //     const response = await sendRequest(() => getGames());

    //     if (response.success) {
    //         setVideojuegos(response.data);
    //     } else {
    //         console.error("Error al obtener los videojuegos:", response.message);
    //     }
    // }

    // useEffect(() => {
    //     fetchData();
    // }, []);


    if (isLoading) {
        // Mostrar un spinner o mensaje de carga mientras se obtienen los videojuegos
        return (
            <div className="container mt-10 flex justify-center items-center flex-col gap-4 text-gray-600">
                <div className="text-6xl animate-spin">
                    🎮
                </div>
                <p className="text-xl font-semibold after:content-[''] after:animate-dots">Cargando juegos</p>
                <p>Preparando tu biblioteca</p>
            </div>
        )
    }
    if (isError) {
        return (
            <div className="container mt-10 flex justify-center items-center flex-col gap-4 text-red-600">
                <div className="text-6xl">❌</div>
                <p className="text-xl font-semibold">Error al obtener los videojuegos</p>
                {console.log(error.message)}
            </div>
        )
    }


    if (videojuegos.length < 1) {
        // Mostrar un mensaje si no hay videojuegos
        return (
            <div className="container mt-10 flex justify-center items-center flex-col gap-4 text-gray-600">
                <div className="text-6xl">
                    👻
                </div>
                <p className="text-xl font-semibold">Nada por aquí</p>
                <p>Tu colección de juegos está esperando</p>
            </div>
        )
    }

    return (
        <div className='grid sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4  gap-4 bg-white dark:bg-gray-800 overflow-hidden'>


            {
                videojuegos.map((game) =>
                    <Videojuego
                        key={game.id}
                        id={game.id}
                        title={game.titulo}
                        genre={game.genero}
                        platform={game.plataforma}
                        sale={game.precioVenta}
                        rent={game.precioAlquiler}
                        stock={game.stock}
                        img={game.imagenUrl} />
                )

            }

        </div>
    )




}

export default Cards