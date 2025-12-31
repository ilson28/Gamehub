import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaGamepad } from "react-icons/fa6";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaTags } from "react-icons/fa6";
import { FaDesktop } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { AiOutlineNumber } from "react-icons/ai";
import { VscLoading } from "react-icons/vsc";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";


import SelectForm from "../ui/SelectForm";
import schema from "../../models/form-game.model";
import FileInputForm from "../games/FileInputForm";
import InputForm from "../ui/InputForm";
import ButtonCard from "../ui/ButtonCard";

const PLATFORMS = [
    { value: "", label: "Escoja la plataforma" },
    { value: "PS5", label: "Ps5" },
    { value: "PS4", label: "Ps4" },
    { value: "XBOX", label: "Xbox" }
]

const GENRES = [
    { value: "", label: "Escoja un genéro" },
    { value: "action", label: "Acción" },
    { value: "adventure", label: "Aventura" },
    { value: "rpg", label: "RPG" },
    { value: "strategy", label: "Estrategia" },
    { value: "sports", label: "Deportes" }
]

const defaultValuesForm = {
    titulo: "",
    genero: "",
    plataforma: "",
    precioVenta: "",
    precioAlquiler: "",
    stock: "",
    imagen: undefined
}


const GameForm = forwardRef(({ onSubmit, loading, mode }, ref) => {

    const [fileName, setFileName] = useState(null);


    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: defaultValuesForm
    });



    const handleResetForm = () => {
        reset(defaultValuesForm);
        setFileName(null);
    };


    // Exponer funciones al padre
    useImperativeHandle(ref, () => ({
        resetForm: handleResetForm,
        resetData: (data) => {
            reset(data);
            setFileName(data.imagen || null);
        }
    }));


    return (
        <>
            <form
                id="add-game-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col lg:items-start gap-4  lg:flex-row lg:gap-7 border-b border-gray-950  ">

                <div className="flex flex-col gap-4  lg:w-1/2">

                    <InputForm
                        icon={<FaGamepad size={20} className="text-blue-800" />}
                        name="titulo" type="text" control={control} label="Título" error={errors.titulo}
                        placeholder="Ingrese el título del videojuego"
                    />
                    <SelectForm
                        icon={<FaTags className="text-green-500" size={20} />}
                        name="genero"
                        control={control}
                        label="Género"
                        options={GENRES}
                        error={errors.genero}
                    />
                    <SelectForm
                        icon={<FaDesktop className="text-purple-800" size={20} />}
                        name="plataforma"
                        control={control}
                        label="plataforma"
                        options={PLATFORMS}
                        error={errors.plataforma}
                    />
                    <div className="flex gap-2  flex-wrap w-full ">

                        <InputForm
                            className="grow"
                            icon={<FaDollarSign className="text-green-800" size={20} />}
                            name="precioVenta" type="number" control={control} label="Precio de Venta" error={errors.precioVenta}
                            placeholder="500"
                        />
                        <InputForm
                            className="grow"
                            icon={<FaDollarSign className="text-green-800" size={20} />}
                            name="precioAlquiler" type="number" control={control} label="Precio de Alquiler" error={errors.precioAlquiler}
                            placeholder="200"
                        />
                    </div>
                    <InputForm
                        icon={<AiOutlineNumber className="text-green-800" size={20} />}
                        name="stock" type="number" control={control} label="Stock" error={errors.stock}
                        placeholder="Ingrese el stock del videojuego"
                    />

                </div>

                <div className="flex flex-col gap-10  lg:w-1/2">

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <FaInfoCircle className="text-blue-800" size={20} />
                            <p className=" font-medium text-gray-900">Imagen del Videojuego</p>
                        </div>

                        <div className={
                            twMerge(
                                clsx("flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg  hover:border-blue-600 transition-colors text-gray-600",
                                    errors.imagen && "border-red-600"
                                )
                            )} >

                            <IoCloudUploadOutline size={50} />
                            <p>Haz clic para seleccionar una imagen</p>
                            <p className="font-light" >PNG, JPG, GIF hasta 5MB</p>

                            <div className="flex flex-wrap gap-3">

                                <FileInputForm control={control} label="Subir imagen" name="imagen" setFileName={setFileName} />
                                {fileName && mode == "create" && (
                                    <p className="self-center rounded-sm text-sm px-4 text-white bg-gray-400 font-light truncate">{fileName}</p>
                                )}
                            </div>

                            {errors.imagen && <p className="text-red-500 font-light">{errors.imagen.message}</p>}
                        </div>
                    </div>
                    <div className="px-4 flex flex-col gap-2 bg-blue-100 p-6 rounded-lg" >
                        <h3 className="font-medium text-blue-900">Información</h3>
                        <ul className="list-disc list-inside text-blue-800 font-light">
                            <li>Todos los campos son obligatorios.</li>
                            <li>Los precios deben ser superiores o iguales a 30000.</li>
                            <li>La imagen debe ser menor a 5MB.</li>
                            <li>El stock debe ser mayor a 0.</li>
                        </ul>
                    </div>
                </div>

            </form>

            <div className="flex flex-col  gap-5 lg:flex-row py-5">

                <ButtonCard
                    disabled={loading}
                    type="submit"
                    form="add-game-form"
                    color="blue"
                    className="grow" >
                    {
                        loading ? (
                            <div className="flex justify-center items-center gap-2">
                                <VscLoading className="animate-spin text-2xl" /> Cargando...
                            </div>
                        ) : (
                            mode === "create" ? "Agregar Videojuego" : "Editar Videojuego"
                        )
                    }

                </ButtonCard>
                <ButtonCard
                    disabled={loading}
                    type="button"
                    color="gray" className="grow"
                    onClick={handleResetForm}
                >
                    Limpiar formulario
                </ButtonCard>

            </div>
        </>
    )
});

function getFileName(url) {
    return url.split('/').pop();
}

export default GameForm