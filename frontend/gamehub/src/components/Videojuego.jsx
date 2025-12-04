import { useState } from 'react';
import ButtonCard from './ButtonCard';
import { MdAddShoppingCart } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import useCartContext from '../hooks/useCartContext';
import clsx from 'clsx';
import { RiDeleteBin6Line } from 'react-icons/ri';
const Videojuego = ({ id, title, genre, platform, sale, rent, img, stock, cart = false }) => {

    const { addGameToCart, typeOfTransaction, deleteGame } = useCartContext();

    const [cant, setCant] = useState(1);

    const handleAddGame = () => {
        const game = {
            id,
            titulo: title,
            genero: genre,
            plataforma: platform,
            precioVenta: sale,
            precioAlquiler: rent,
            imagenUrl: img,
            stock
        }

        addGameToCart(game, cant);

    }

    return (
        <div
            className={clsx("rounded-lg flex flex-col gap-2 relative before:content-[attr(data-stock)] before:absolute before:top-1 before:right-2 before:p-2 before:rounded-md before:bg-green-100 before:text-green-600 text-sm",
                cart && "sm:before:content-[''] sm:before:p-0",
                cart && "p-4"
            )}
            data-stock={`Stock: ${stock}`}
        >
            <div className={clsx({
                "flex flex-col sm:flex-row": cart,
            })}>

                <figure className={clsx("h-60", cart && "sm:h-35 sm:w-35")}>
                    <img
                        className="w-full rounded-t-lg h-full object-cover object-center"
                        src={img}
                        alt={title}
                    />
                </figure>

                <div className="p-4 w-full relative">
                    <h3 className="font-bold text-xl text-gray-900">{title}</h3>

                    <div className={clsx("flex flex-col gap-2 mt-2",
                        cart && "sm:flex-row sm:justify-between"
                    )}>
                        <div className={clsx(cart && "flex flex-col gap-3")}>

                            <div className={clsx("flex items-center text-gray-600 gap-1 justify-between",
                                cart && "sm:justify-normal"
                            )}>
                                <span>Género</span>
                                <span className='text-blue-700 font-bold'>{genre}</span>
                            </div>
                            <div className={clsx("flex items-center text-gray-600 gap-1 justify-between",
                                cart && "sm:justify-normal"
                            )}>
                                <span>Plataforma</span>
                                <span className='text-purple-700 font-bold'>{platform}</span>
                            </div>
                        </div>
                        <div className={clsx(cart && "flex flex-col gap-3")}>

                            <div className={clsx("flex items-center text-gray-600 gap-1 justify-between",
                                cart && "sm:justify-normal"
                            )}>
                                <span>Venta</span>
                                <span className='text-green-700 font-bold'>${sale}</span>
                            </div>
                            <div className={clsx("flex items-center text-gray-600 gap-1 justify-between",
                                cart && "sm:justify-normal"
                            )}>
                                <span>Alquiler</span>
                                <span className='text-orange-700 font-bold'>${rent}</span>
                            </div>
                        </div>


                        {cart ?


                            <div
                                onClick={() => deleteGame(id)}
                                className={clsx("self-end mt-3 flex flex-col gap-3 text-xl cursor-pointer")}>
                                <RiDeleteBin6Line className='text-red-600 sm:absolute sm:absolute:content[""] ml-auto sm:top-4.5' />
                                <p className='font-bold sm:absolute sm:absolute:content[""] sm:bottom-3 sm:right-0'>
                                    ${typeOfTransaction === 'venta' ? sale : rent}
                                </p>
                            </div>
                            :
                            <div className="ml-1 flex items-center justify-between mt-2">
                                <span>Cantidad</span>
                                <div className='flex items-center gap-2'>
                                    <ButtonCard
                                        disabled={cant === 1}
                                        onClick={() => setCant(cant > 1 ? cant - 1 : 1)}
                                        className="bg-gray-200 w-8 py-2 font-semibold"> - </ButtonCard>
                                    <input
                                        readOnly
                                        min={1}
                                        value={cant}
                                        className='w-16 text-center font-bold focus:outline-none rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500'
                                        type="number" />
                                    <ButtonCard
                                        onClick={() => setCant(cant < stock ? cant + 1 : cant)}
                                        className="bg-gray-200 w-8 py-2 font-semibold">+</ButtonCard>
                                </div>
                            </div>

                        }
                    </div>
                    {
                        !cart &&
                        <div className='py-4 flex gap-2'>
                            <ButtonCard
                                disabled={stock == 0}
                                color={"blue"}
                                className="grow flex justify-center"
                                onClick={handleAddGame} >

                                <MdAddShoppingCart size={28} />

                            </ButtonCard>
                            <ButtonCard color="orange" className="grow relative" >
                                <NavLink to={`/add-game/${id}`} className="absolute inset-0 w-full h-full flex items-center justify-center" >
                                    <FaEdit size={25} />
                                </NavLink>
                            </ButtonCard>

                        </div>}

                </div>
            </div>

        </div >
    );
};

export default Videojuego;