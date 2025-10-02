import Videojuego from "../components/Videojuego";
import useCartContext from "../hooks/useCartContext"


const Cart = () => {

    const { games } = useCartContext();


    return <div className="container">

        <div className="flex flex-col gap-2 my-4">
            <h1 className="text-gray-900 font-bold text-3xl">Carrito de Compras</h1>
            <span className="text-gray-500">Revisa tus videojuegos y completa tu transacción</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-b-sm">

            <div className="p-5 border-b border-b-gray-200 text-xl font-semibold text-gray-900">
                <p>Videojuegos en el carrito</p>
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



    </div>
}

export default Cart;