

import { clsx } from "clsx";
import { Controller } from "react-hook-form";



const FileInputForm = ({ name, control, label, className, setFileName }) => {

    return (

        <div className={clsx("w-50 relative bg-blue-600 text-white text-center p-2 rounded-lg cursor-pointer", className)}>

            {label}
            <Controller
                name={name}
                control={control}
                render={({ field }) =>
                    <input
                        id={name}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                            setFileName(file?.name || null); // Guarda el nombre del archivo
                        }}
                        ref={field.ref}
                        className={clsx(
                            "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        )} />

                }
            />


        </div>
    )
}

export default FileInputForm