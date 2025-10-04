import Videojuego from "../components/Videojuego";
import useCartContext from "../hooks/useCartContext"


const Cart = () => {

    const { games } = useCartContext();


    return <div className="container">

        <div className="flex flex-col gap-2 my-4">
            <h1 className="text-gray-900 font-bold text-3xl">Carrito de Compras</h1>
            <span className="text-gray-500">Revisa tus videojuegos y completa tu transacción</span>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">

            <div className="bg-white border border-gray-200 rounded-b-sm grow">

                <div className="p-5 border-b border-b-gray-200 text-xl font-medium text-gray-900">
                    <h2>Videojuegos en el carrito</h2>
                </div>
                {
                    games.map(game => (<div key={game.id} className="p-4 border-b border-b-gray-200">
                        <Videojuego
                            id={game.id}
                            title={game.titulo}
                            genre={game.genero}
                            platform={game.plataforma}
                            sale={game.precioVenta}
                            rent={game.precioAlquiler}
                            stock={game.stock}
                            img={game.imagenUrl}
                            cart />
                    </div>))
                }

            </div>

            <div className="bg-white border border-gray-200 rounded-b-sm grow">
                <div className="p-5 text-md md:text-xl font-medium text-gray-900">
                    <h2>Tipo de transacción</h2>
                </div>
                <div className="px-5 flex flex-col gap-3 ">
                    <div className="flex items-center gap-3 border-2 border-gray-300 p-3 rounded-md">
                        <input type="radio" name="type" defaultChecked id="sale" />
                        <label htmlFor="sale">Venta</label>
                    </div>
                    <div className="flex items-center gap-3 border-2 border-gray-300 p-3 rounded-md">
                        <input type="radio" name="type" id="rent" />
                        <label htmlFor="rent">Alquiler</label>
                    </div>

                </div>
            </div>
        </div>



    </div>
}

export default Cart;