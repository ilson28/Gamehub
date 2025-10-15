import { MdOutlineShoppingCart } from "react-icons/md";
import ButtonCard from "../components/ButtonCard";
import ClientForm from "../components/ClientForm";
import InputRadioCart from "../components/InputRadioCart";
import Videojuego from "../components/Videojuego";
import useCartContext from "../hooks/useCartContext"
import { useRef, useState } from "react";
import { createTransaction } from "../services/transaccionService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VscLoading } from "react-icons/vsc";



const Cart = () => {

    const queryClient = useQueryClient();
    const [date, setDate] = useState(null);
    const { games, typeOfTransaction, setTypeOfTransaction, transJuegos, calculateTotal } = useCartContext();
    const formclientRef = useRef();

    //mutacion para crear la transaccion
    const mutation = useMutation({

        mutationFn: (transaction) => createTransaction(transaction),
        onSuccess: (response) => {
            console.log("Transaccion creada exitosamente", response.data);
            // formclientRef.current?.resetForm();
            queryClient.invalidateQueries(["transactions"]);//invalidar query de transacciones para que se actualice la lista
        }
    })

    const handleSubmit = (data) => {

        if (typeOfTransaction === 'alquiler' && !date) return;

        const transactionData = {

            tipo: typeOfTransaction,
            fechaDev: typeOfTransaction === 'alquiler' ? date : null,
            cliente: { ...data, sexo: '0', role: "CLIENTE", username: data.cedula, password: data.cedula },
            transJuegos

        };
        mutation.mutate(transactionData);
        console.log("Formulario enviado", transactionData);

    }


    return <div className="container">

        <div className="flex flex-col gap-2 my-4">
            <h1 className="text-gray-900 font-bold text-3xl">Carrito de Compras</h1>
            <span className="text-gray-500">Revisa tus videojuegos y completa tu transacción</span>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row lg:basis-1/2">

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

            <div className="flex flex-col gap-5 lg:basis-1/3">

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

                        {
                            typeOfTransaction === 'alquiler' &&

                            <div className="flex flex-col gap-1 mt-1">
                                <label htmlFor="fechaDev" className="text-gray-700 font-medium text-sm">Fecha de devolución</label>
                                <input
                                    onChange={(e) => setDate(e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="date"
                                    name="fechaDev"
                                    id="fechaDev" />

                            </div>
                        }


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
                            <p className="font-extrabold text-3xl">${calculateTotal()}</p>
                        </div>
                    </div>
                    <ButtonCard
                        form="client-form"
                        className="px-3 w-full mt-4"
                        color="blue"
                        disabled={games.length == 0}
                    >
                        {
                            mutation.isPending ? (
                                <div className="flex justify-center items-center gap-2">
                                    <VscLoading className="animate-spin text-2xl" /> Cargando...
                                </div>
                            )
                                :
                                "Finalizar Transaccion"
                        }
                    </ButtonCard>
                </div>
            </div>

        </div>



    </div>
}

export default Cart;