

import { clsx } from "clsx";
import { Controller } from "react-hook-form";



const InputForm = ({ name, control, label, type, error, placeholder, className, icon, iconLogin }) => {
    return (

        <div className={clsx("flex flex-col min-h-32 gap-2", className)}>
            <div className="flex items-center gap-2">
                {icon && icon}
                <label className="text-gray-700 font-medium text-sm" htmlFor={name}>
                    {label}
                </label>
            </div>
            <Controller
                name={name}
                control={control}
                render={({ field }) =>
                    <div className="relative text-gray-500">
                        <input id={name} type={type} {...field} placeholder={placeholder}
                            className={clsx(
                                "w-full h-full bg-gray-50 py-4 border border-gray-300 rounded-lg focus:border-blue-500 outline-none",
                                !iconLogin ? "px-2" : "px-12",
                                error && "border-red-600"
                            )} />
                        {iconLogin && iconLogin}
                    </div>



                }
            />

            {error && <p className="text-red-500 font-light text-xs sm:text-base">{error.message}</p>}
        </div>
    )
}

export default InputForm