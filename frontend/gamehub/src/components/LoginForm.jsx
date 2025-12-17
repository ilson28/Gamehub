import { forwardRef, useImperativeHandle } from "react"
import loginSchema from "../models/form-login.model"
import InputForm from "./InputForm"
import { FaRegUser } from "react-icons/fa6"
import { TbLockPassword } from "react-icons/tb"
import ButtonCard from "./ButtonCard"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


const defaultValuesForm = {
    username: '',
    password: ''
}
const LoginForm = forwardRef(({ onSubmit }, ref) => {

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(loginSchema),
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
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <InputForm
                    type="text"
                    label="Username"
                    control={control}
                    error={errors.username}
                    name="username"
                    placeholder="adminGamehub"
                    iconLogin={<FaRegUser size={16} className="absolute top-1/2 -translate-y-1/2 left-3" />}
                />
                <InputForm
                    label="Password"
                    control={control}
                    error={errors.password}
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    iconLogin={<TbLockPassword size={16} className="absolute top-1/2 -translate-y-1/2 left-3" />}
                />
                <ButtonCard
                    type="submit"
                    color="blue"

                >
                    Acceder al Sistema
                </ButtonCard>

            </div>

        </form>
    )
})

export default LoginForm