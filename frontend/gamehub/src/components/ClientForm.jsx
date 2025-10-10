import { forwardRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form";
import clientSchema from "../models/form-client.model";
import InputForm from "./InputForm";
import { zodResolver } from "@hookform/resolvers/zod";

const defaultValuesForm = {
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    direccion: "",

}


const ClientForm = forwardRef(({ onSubmit, loading }, ref) => {

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(clientSchema),
        mode: "onBlur",
        defaultValues: defaultValuesForm,

    })

    const handleResetForm = () => {
        reset(defaultValuesForm);
    };

    // Exponer funciones al padre
    useImperativeHandle(ref, () => ({
        resetForm: handleResetForm,
        resetData: (data) => {
            reset(data);
        }
    }));

    return <form
        id="client-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 p-5"
    >

        <InputForm
            name="cedula"
            control={control}
            error={errors.cedula}
            label="Cedula"
            placeholder="1002278977"
            type="number"
        />
        <InputForm
            name="nombre"
            control={control}
            error={errors.nombre}
            label="Nombre"
            placeholder="Jhon"
            type="text"
        />
        <InputForm
            name="apellido"
            control={control}
            error={errors.apellido}
            label="Apellidos"
            placeholder="Perez Garcia"
            type="text"
        />
        <InputForm
            name="direccion"
            control={control}
            error={errors.direccion}
            label="Direccion"
            placeholder="Cra 51b #79-56"
            type="text"
        />
        <InputForm
            name="telefono"
            control={control}
            error={errors.telefono}
            label="Telefono"
            placeholder="3001234567"
            type="number"
        />



    </form>

});

export default ClientForm;