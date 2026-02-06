
import { IoGameControllerOutline } from "react-icons/io5"
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authService";
import useAuthContext from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";


const Login = () => {

    const [authError, setAuthError] = useState(false);
    const formRef = useRef();
    const navigate = useNavigate();
    const [hidden, setHidden] = useState(true);
    const { loginContext } = useAuthContext();
    const mutate = useMutation({
        mutationFn: ({ username, password }) => login(username, password),
        onSuccess: (data) => {
            // console.log("Login exitoso", data);
            loginContext(data.jwt);
            formRef.current.resetForm();
            navigate("/");
        },
        onError: (error) => {
            // console.error("Error en login", error.response);
            if (error.response?.status === 401) setAuthError(true);

        }
    });

    const handleSubmit = (data) => {

        // console.log("Submitting", data);
        mutate.mutate(data);
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            setHidden(false);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen">
            <div className="flex justify-center">

                {/* Contenedor del contenido principal */}
                <div className={clsx("flex justify-center max-w-3xl grow flex-1/2 px-6 py-3 transition-all duration-700 ease-in-out",
                    hidden ? "opacity-0 translate-y-20" : "opacity-100 translate-y-0",
                )}>
                    <div className="flex flex-col grow justify-center gap-8 max-w-lg">

                        {/* Titulo */}
                        <div className="flex gap-3 items-center">
                            <div className="p-2 bg-blue-500 rounded-xl">
                                <IoGameControllerOutline className="text-white text-4xl" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">GameHub</h1>
                        </div>

                        {/* Subtitulo */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-gray-900 text-3xl font-bold">
                                Acceso administrativo
                            </h2>
                            <p className="text-gray-500 text-md">
                                Ingrese sus credenciales para continuar
                            </p>
                        </div>

                        {/* Inputs de username y password */}
                        <LoginForm
                            onSubmit={handleSubmit}
                            isLoading={mutate.isPending}
                            ref={formRef}
                            isError={authError}
                        />

                        {/* Credenciales de demostracion */}
                        <div
                            className="flex flex-col gap-2 p-3 rounded-xl text-gray-500 border-dashed border-2 border-gray-300">
                            <p>Credenciales de demostración</p>
                            <div className="flex gap-2">
                                <p className="text-gray-800">Usuario demo:</p>
                                <p>adminGamehub</p>

                            </div>
                            <div className="flex gap-2">
                                <p className="text-gray-800">Contraseña:</p>
                                <p>admin123</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/*Right Side - Visual Panel (Desktop Only) */}
                <div className="hidden min-h-lvh lg:flex justify-center items-center flex-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">

                    <div className="flex flex-col gap-12 justify-center h-full">
                        <div className="p-15 bg-white/20 rounded-xl animate-bounce">
                            <IoGameControllerOutline className="text-white" size={100} />
                        </div>

                        <div className="flex justify-between">
                            <div className="flex flex-col bg-white/20 rounded-xl p-6 gap-2">
                                <div className="bg-white/10 w-10 h-10 rounded-xl"></div>
                                <div className="bg-white/10 h-2 rounded-xl"></div>
                                <div className="w-2/3 bg-white/10 h-2 rounded-xl"></div>
                            </div>
                            <div className="flex flex-col bg-white/20 rounded-xl p-6 gap-2">
                                <div className="bg-white/10 w-10 h-10 rounded-xl"></div>
                                <div className="bg-white/10 h-2 rounded-xl"></div>
                                <div className="w-2/3 bg-white/10 h-2 rounded-xl"></div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login