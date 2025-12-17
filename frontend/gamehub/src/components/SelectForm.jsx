import { clsx } from "clsx";
import { Controller } from "react-hook-form";




function SelectForm({ control, name, label, options, error, icon }) {
    return (
        <div className="flex flex-col gap-2 min-h-32">
            <div className="flex items-center gap-2">
                {icon}
                <label htmlFor={name} className="text-gray-700 font-medium text-sm">{label}</label>
            </div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <select
                        name={name}
                        id={name}
                        {...field}
                        className={clsx(
                            "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:border-blue-500 block w-full p-4",
                            error && "border-red-600"
                        )}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
            />
            {error && <p className="text-red-500 font-light ">{error.message}</p>}
        </div>
    )
}

export default SelectForm