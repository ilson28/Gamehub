import { clsx } from "clsx";
import { NavLink } from "react-router-dom";


const NavItem = ({ children, to, onClick }) => {
    return (

        <NavLink
            onClick={onClick}
            to={to}
            className={({ isActive }) =>
                clsx(
                    "flex items-center md:w-max gap-3 p-2 rounded-md",
                    isActive && "text-blue-700 bg-blue-100 ",

                )
            }
        >
            {children}
        </NavLink>

    );
};

export default NavItem;