

import { clsx } from "clsx";
import { Controller } from "react-hook-form";



const InputForm = ({ name, control, label, type, error, placeholder, className, icon }) => {
    return (

        <div className={clsx("flex flex-col min-h-32 gap-2", className)}>
            <div className="flex items-center gap-2">
                {icon}
                <label className="text-gray-600" htmlFor={name}>{label}</label>
            </div>
            <Controller

                name={name}
                control={control}
                render={({ field }) =>
                    <input id={name} type={type} {...field} placeholder={placeholder}
                        className={clsx(
                            " bg-gray-50 py-4 px-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none",
                            error && "border-red-600"
                        )} />

                }
            />
            {error && <p className="text-red-500 font-light">{error.message}</p>}
        </div>
    )
}

export default InputForm