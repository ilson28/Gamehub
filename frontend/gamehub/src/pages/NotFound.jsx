import { HiOutlineEmojiSad } from "react-icons/hi";
import { GoHome } from "react-icons/go";
import ButtonCard from "../components/ui/ButtonCard";
import { useNavigate } from "react-router-dom";
const NotFound = () => {


    const navigate = useNavigate();

    return <div className="mx-auto overflow-hidden p-4 text-center max-w-2xl min-h-lvh animate-fade-in-up">

        <div className="flex flex-col items-center gap-4">

            {/* Main icon container  */}
            <div className="relative py-6">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-12 border-2 border-blue-200/50 shadow-xl">

                    {/* Card */}
                    <div className="relative animate-spin">

                        {/* 404 Illustration */}
                        <HiOutlineEmojiSad className="w-40 h-40 text-blue-600" />

                        {/* Decorative elements  */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-700 rounded-lg opacity-20 transform rotate-12"></div>
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-lg opacity-20 transform -rotate-12"></div>
                    </div>
                </div>
            </div>
            {/* Main Message */}
            <div className="flex flex-col gap-4">
                <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Página no encontrada</h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
                    La ruta a la que intentas acceder no existe o no está disponible.
                </p>
            </div>

            {/* Action Buttons  */}
            <div className="flex w-full sm:w-56">
                <ButtonCard
                    color="blue"
                    className="grow py-4"
                    onClick={() => navigate('/')}
                >
                    <div className="flex gap-2 justify-center items-center">
                        <GoHome size={22} />
                        <span>Volver al inicio</span>
                    </div>
                </ButtonCard>
            </div>
        </div>
    </div>
}
export default NotFound;