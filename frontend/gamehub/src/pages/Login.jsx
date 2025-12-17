import { FaRegUser } from "react-icons/fa6"
import { IoGameControllerOutline } from "react-icons/io5"
import { TbLockPassword } from "react-icons/tb";
import ButtonCard from "../components/ButtonCard";
import clsx from "clsx";
import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";


const Login = () => {

    const [hidden, setHidden] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => {
            setHidden(false);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen">
            <div className="flex">

                {/* Contenedor del contenido principal */}
                <div className={clsx("flex justify-center max-w-3xl grow flex-1/2 px-10 py-5 transition-all duration-700 ease-in-out",
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
                        <LoginForm />

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

                        {/* <!-- Footer --> */}
                        < footer className="px-6 bg-gray-50 border-t border-gray-200" >
                            <div>
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-gray-500 tracking-wide">Internal management system</p>
                                    <p className="text-xs text-gray-400">Built by Ilson Díaz Morelo</p>
                                </div>
                            </div>
                        </footer >
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