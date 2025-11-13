import { FaCircleCheck } from "react-icons/fa6";

import ButtonCard from "../components/ButtonCard";
import { useEffect } from "react";


import React from 'react'


const GameModal = ({ game, onClose, gameId }) => {

    useEffect(() => {
        game ? document.body.classList.add('overflow-hidden') :
            document.body.classList.remove('overflow-hidden');

        return () => document.body.classList.remove('overflow-hidden');

    }, [game]);


    return (
        <>
            {
                game &&
                <div className="bg-white py-10  rounded-lg shadow-lg min-h-96 overflow-hidden min-w-96" >

                    <div className="flex flex-col gap-5 items-center">
                        <FaCircleCheck className="text-6xl text-green-500" />
                        <div className="flex gap-2 flex-col items-center text-gray-600">
                            <p className="text-xl text-gray-800 font-bold">{`¡Videojuego ${gameId ? "editado" : "agregado"}!`}</p>
                            <p className="text-sm">Se ha añadido correctamente a tu biblioteca</p>
                        </div>

                        <div className="border-t border-gray-200 p-6 w-full">

                            <div className="p-4 flex gap-4 rounded-xl border border-gray-200 bg-gray-100 ">
                                <figure className="h-30 w-30">
                                    <img className="w-full h-full block object-cover object-center" src={game.imagenUrl} alt="game photo" />
                                </figure>
                                <div >
                                    <h2>{game.titulo}</h2>
                                    <div className="flex flex-col gap-1 text-gray-600 mt-2 min-w-60">

                                        <div className="flex justify-between items-center ">
                                            <p className="text-sm">Plataforma:</p>
                                            <p className="text-sm text-purple-700 font-bold">{game.plataforma}</p>
                                        </div>
                                        <div className="flex justify-between items-center ">
                                            <p className="text-sm">Género:</p>
                                            <p className="text-sm text-blue-700 font-bold">{game.genero}</p>
                                        </div>
                                        <div className="flex justify-between items-center ">
                                            <p className="text-sm">Precio venta:</p>
                                            <p className="text-sm text-green-700 font-bold">${game.precioVenta}</p>
                                        </div>
                                        <div className="flex justify-between items-center ">
                                            <p className="text-sm">Precio alquiler:</p>
                                            <p className="text-sm text-green-700 font-bold">${game.precioAlquiler}</p>
                                        </div>
                                        <div className="flex justify-between items-center ">
                                            <p className="text-sm">Stock:</p>
                                            <p className="text-sm text-orange-700 font-bold">{game.stock}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <ButtonCard
                            onClick={onClose}
                            color="blue" className="w-30">
                            Aceptar
                        </ButtonCard>
                    </div>

                </div>
            }
        </ >
    )
}

export default GameModal