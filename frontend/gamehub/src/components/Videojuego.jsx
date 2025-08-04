import React from 'react';
import ButtonCard from './ButtonCard';
import { MdAddShoppingCart } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
const Videojuego = ({ id, title, genre, platform, sale, rent, img, stock }) => {
    return (
        <div
            className="pb-4 rounded-lg shadow-md flex flex-col gap-2 relative before:content-[attr(data-stock)] before:absolute before:top-1 before:right-2 before:p-2 before:rounded-md before:bg-green-100 before:text-green-600 text-sm"
            data-stock={`Stock: ${stock}`}
        >
            <figure className="h-60">
                <img
                    className="w-full rounded-t-lg h-full object-cover object-center"
                    src={img}
                    alt={title}
                />
            </figure>

            <div className="p-4">
                <h3 className="font-bold text-xl text-gray-900">{title}</h3>

                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Género</span>
                        <span className='text-blue-700 font-bold'>{genre}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Plataforma</span>
                        <span className='text-purple-700 font-bold'>{platform}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Venta</span>
                        <span className='text-green-700 font-bold'>${sale}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Alquiler</span>
                        <span className='text-orange-700 font-bold'>${rent}</span>
                    </div>
                </div>
                <div className='py-4 flex gap-2'>
                    <ButtonCard color={"blue"} className="grow flex justify-center" >

                        <MdAddShoppingCart size={28} />

                    </ButtonCard>
                    <ButtonCard color="orange" className="grow relative">
                        <NavLink to={`/add-game/${id}`} className="absolute inset-0 w-full h-full flex items-center justify-center" >
                            <FaEdit size={25} />
                        </NavLink>
                    </ButtonCard>

                </div>

            </div>
        </div>
    );
};

export default Videojuego;