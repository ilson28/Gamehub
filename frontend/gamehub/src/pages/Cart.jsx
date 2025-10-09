import { MdOutlineShoppingCart } from "react-icons/md";
import ButtonCard from "../components/ButtonCard";
import ClientForm from "../components/ClientForm";
import InputRadioCart from "../components/InputRadioCart";
import Videojuego from "../components/Videojuego";
import useCartContext from "../hooks/useCartContext"
import { useRef } from "react";


const Cart = () => {

    const { games, typeOfTransaction, setTypeOfTransaction } = useCartContext();
    const formclientRef = useRef();

    const handleSubmit = (data) => {
        e.preventDefault();

        const transactionData = {

            tipo: typeOfTransaction,
            fechaDev: typeOfTransaction === 'alquiler' ? new Date() : null
        };

        console.log("Formulario enviado", transactionData);

    }


    return <div className="container">

        <div className="flex flex-col gap-2 my-4">
            <h1 className="text-gray-900 font-bold text-3xl">Carrito de Compras</h1>
            <span className="text-gray-500">Revisa tus videojuegos y completa tu transacción</span>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row">

            <div className="bg-white border border-gray-200 rounded-md grow h-fit">

                <div className="p-5 border-b border-b-gray-200 text-xl font-medium text-gray-900">
                    <h2>Videojuegos en el carrito</h2>
                </div>
                {games.length > 0
                    ?
                    (games.map(game => (<div key={game.id} className="p-4 border-b border-b-gray-200">
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
                    </div>)))
                    :
                    <div className="flex flex-col gap-3 items-center justify-center py-10">
                        <MdOutlineShoppingCart size={64} className="text-gray-400" />
                        <p className="text-gray-600">El carrito esta vacio</p>
                        <p className="text-gray-400 text-sm">Agrega videojuegos desde la pagina de Inicio</p>
                    </div>
                }

            </div>

            <div className="flex flex-col gap-5 grow">

                <div className="bg-white border border-gray-200 rounded-md">
                    <div className="p-5 text-md md:text-xl font-medium text-gray-900">
                        <h2>Tipo de transacción</h2>
                    </div>
                    <div className="px-5 pb-4 flex flex-col gap-3 ">

                        <InputRadioCart
                            id={'sale'}
                            name={'type'}
                            checked={typeOfTransaction === 'venta'}
                            onChange={() => setTypeOfTransaction('venta')}
                            label={'Venta'}
                        />
                        <InputRadioCart
                            id={'rent'}
                            name={'type'}
                            checked={typeOfTransaction === 'alquiler'}
                            onChange={() => setTypeOfTransaction('alquiler')}
                            label={'Alquiler'}
                        />


                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-md">
                    <div className="p-5 text-md md:text-xl font-medium text-gray-900">
                        <h2>Información del cliente</h2>
                    </div>
                    <ClientForm
                        onSubmit={handleSubmit}
                        ref={formclientRef}
                    />
                </div>
                <div className="bg-white border border-gray-200 rounded-md p-5">
                    <div className="text-md md:text-xl font-medium text-gray-900">
                        <h2>Resumen</h2>
                    </div>
                    <div className="text-gray-600 mt-4 flex flex-col gap-2 border-b border-b-gray-300 pb-2">
                        <div className="flex justify-between">
                            <p>Videojuegos</p>
                            <p>{games.length}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Tipo</p>
                            <p className="text-blue-600">{typeOfTransaction}</p>
                        </div>
                    </div>
                    <div className="text-gray-600 mt-4 flex flex-col ">
                        <div className="flex justify-between text-2xl text-gray-950">
                            <p>Total</p>
                            <p className="font-extrabold text-3xl">${games.length}</p>
                        </div>
                    </div>
                    <ButtonCard
                        form="client-form"
                        className="px-3 w-full mt-4"
                        color="blue"
                        disabled={games.length == 0}
                    >
                        Finalizar Transaccion
                    </ButtonCard>
                </div>
            </div>

        </div>



    </div>
}

export default Cart;