import { IoGameControllerOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaPlus } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { SlReload } from "react-icons/sl";
import { RiHistoryFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

import NavItem from "../components/layout/NavItem";
import { useState } from "react";
import { clsx } from "clsx";



const Header = () => {

    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { to: "/home", icon: <IoGameControllerOutline size={18} />, label: "Inicio" },
        { to: "/add-game", icon: <FaPlus />, label: "Agregar Juego" },
        { to: "/returns", icon: <SlReload />, label: "Devoluciones" },
        { to: "/history", icon: <RiHistoryFill />, label: "Historial" },
        { to: "/cart", icon: <FaCartShopping />, label: "Carrito" },
    ];



    return (

        <header className="shadow-lg sticky top-0 z-50 bg-white">
            <nav className="container flex flex-col gap-4 md:flex-row md:justify-between ">

                <div className="ml-2 flex justify-between items-center ">

                    <div className="flex gap-3 items-center font-bold text-gray-800">
                        <IoGameControllerOutline className="text-blue-700 text-2xl md:text-4xl" />
                        <h1 className="text-xl tracking-wider">GameHub</h1>
                    </div>

                    <button
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                        className="md:hidden text-3xl text-gray-600"
                        onClick={() => setIsOpen(!isOpen)} >
                        {isOpen ? <IoClose size={36} /> : <GiHamburgerMenu />}
                    </button>

                </div>

                {/* {isOpen && <hr className="md:hidden border-gray-200" />} */}

                {isOpen && <div className={clsx("md:hidden before:content-[''] before:absolute before:left-0 before:right-0 before:h-[0.5px] before:bg-gray-200 before:mb-10")}></div>}


                {/* Mobile Menu */}
                <div className={clsx("md:hidden  text-gray-600  text-xl flex flex-col gap-6 transition-all ease-in-out duration-700",
                    isOpen
                        ? "max-h-96 opacity-100 translate-y-0 scale-100"
                        : "max-h-0 opacity-0 -translate-y-4 scale-95 pointer-events-none"
                )} >

                    {navItems.map(({ icon, to, label }) =>

                        <NavItem key={to} to={to} onClick={() => setIsOpen(false)} >
                            {icon}{label}
                        </NavItem>
                    )}
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex lg:gap-6 text-base items-center text-gray-600">
                    {navItems.map(({ icon, to, label }) =>

                        <NavItem key={to} to={to}  >
                            {icon}{label}
                        </NavItem>
                    )}
                </div>
            </nav>
        </header >


    )
}

export default Header;
