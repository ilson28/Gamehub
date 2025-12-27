import { forwardRef, useImperativeHandle } from "react"
import loginSchema from "../../models/form-login.model"
import InputForm from "../ui/InputForm"
import { FaRegUser } from "react-icons/fa6"
import { TbLockPassword } from "react-icons/tb"
import ButtonCard from "../ui/ButtonCard"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { VscLoading } from "react-icons/vsc"
import { FiAlertTriangle } from "react-icons/fi"
import clsx from "clsx"


const defaultValuesForm = {
    username: '',
    password: ''
}
const LoginForm = forwardRef(({ onSubmit, isLoading, isError }, ref) => {

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
            <div className="flex flex-col">
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
                    disabled={isLoading}

                >
                    {
                        isLoading ? <div className="flex justify-center items-center gap-2">
                            <VscLoading className="animate-spin text-2xl" /> Cargando...
                        </div>
                            : "Acceder al sistema"

                    }
                </ButtonCard>

                {/* Alerta de credenciales invalidas  */}
                <div className={clsx("overflow-hidden transition-all duration-700 ease-in-out",
                    isError ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                )}>
                    <div className="mt-4 p-4 flex gap-2 rounded-2xl border-l-4 border-red-500 text-red-600 bg-red-50 hover:bg-red-100/80">

                        <FiAlertTriangle />

                        <div>
                            <p className="text-xs font-semibold text-red-800 mb-1">Credenciales inválidas</p>
                            <p className="text-xs sm:text-base text-red-700">El usuario o la contraseña no son correctos.</p>
                        </div>

                    </div>
                </div>

            </div>

        </form>
    )
})

export default LoginForm