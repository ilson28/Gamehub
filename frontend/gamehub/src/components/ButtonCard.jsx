import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"


const colors = {
    blue: "bg-blue-500 text-white font-bold hover:bg-blue-600",
    orange: "bg-orange-500 text-white font-bold hover:bg-orange-600",
    gray: "bg-gray-500 text-white font-bold hover:bg-gray-600",
}


const ButtonCard = ({ children, color, onClick, className, type, form, disabled }) => {

    return (

        <button
            disabled={disabled}
            form={form}
            type={type}
            className={twMerge(clsx("text-center py-3 rounded-md cursor-pointer",
                "disabled:opacity-50  disabled:cursor-not-allowed",
                colors[color],
                className
            ))}
            onClick={onClick}>
            {children}
        </button>
    )
}

export default ButtonCard