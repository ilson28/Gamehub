import { clsx } from "clsx";
import { NavLink } from "react-router-dom";
import useCartContext from "../hooks/useCartContext";


const NavItem = ({ children, to, onClick }) => {

    const { games } = useCartContext();
    return (

        <NavLink
            onClick={onClick}
            to={to}
            className={({ isActive }) =>
                clsx(
                    "flex items-center md:w-max gap-3 p-2 rounded-md relative",
                    isActive && "text-blue-700 bg-blue-100",
                    !isActive && to == '/cart' && games.length > 0 && "before:content-[attr(data-cantidad)] before:absolute before:-top-1 before:-right-1 before:bg-red-500 before:text-white before:text-xs before:rounded-full before:w-5 before:h-5 before:flex before:items-center before:justify-center before:font-bold"

                )
            }
            data-cantidad={games.length}
        >
            {children}
        </NavLink>

    );
};

export default NavItem;