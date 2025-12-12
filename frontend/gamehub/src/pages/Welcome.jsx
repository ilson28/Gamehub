import { IoGameControllerOutline } from "react-icons/io5"

const Welcome = () => {
    return (
        <div>
            {/* Navbar  */}
            <nav class="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center space-x-2">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center">
                                <IoGameControllerOutline className="text-blue-700 text-2xl md:text-4xl" />
                            </div>
                            <span class="text-xl font-bold text-slate-800">GameHub</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <button class="hidden sm:block px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition duration-200">
                                Iniciar sesión
                            </button>
                            <button class="px-5 py-2 text-sm font-medium text-white gradient-bg rounded-lg hover:opacity-90 transition duration-200 shadow-lg shadow-purple-500/30">
                                Crear cuenta
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section  */}
            <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Content  */}
                        <div class="space-y-8">
                            <div class="inline-flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-full">
                                <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                <span class="text-sm font-medium text-purple-700">Sistema de gestión profesional</span>
                            </div>

                            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                                Gestión inteligente de
                                <span class="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    videojuegos
                                </span>
                            </h1>

                            <p class="text-xl text-slate-600 leading-relaxed max-w-xl">
                                Administra ventas, alquileres, devoluciones y clientes desde una sola plataforma moderna y eficiente.
                            </p>

                            <div class="flex flex-col sm:flex-row gap-4">
                                <button class="px-8 py-4 text-base font-semibold text-white gradient-bg rounded-xl hover:opacity-90 transition duration-200 shadow-xl shadow-purple-500/30">
                                    Crear cuenta gratis
                                </button>
                                <button class="px-8 py-4 text-base font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition duration-200">
                                    Iniciar sesión
                                </button>
                            </div>

                            <div class="flex items-center space-x-8 pt-4">
                                <div class="flex items-center space-x-2">
                                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                    <span class="text-sm text-slate-600 font-medium">Sin tarjeta de crédito</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                    <span class="text-sm text-slate-600 font-medium">Configuración en minutos</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Mockup  */}
                        <div class="relative">
                            <div class="absolute inset-0 gradient-bg opacity-20 blur-3xl rounded-full"></div>
                            <div class="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
                                <div class="space-y-4">
                                    {/*  Mock header  */}
                                    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
                                        <div class="flex space-x-2">
                                            <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                                            <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                            <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                                        </div>
                                        <div class="text-xs font-medium text-slate-400">Dashboard</div>
                                    </div>

                                    {/*  Mock stats  */}
                                    <div class="grid grid-cols-3 gap-3">
                                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                                            <div class="w-8 h-8 bg-blue-500 rounded-lg mb-2"></div>
                                            <div class="h-2 bg-blue-200 rounded w-12 mb-2"></div>
                                            <div class="h-4 bg-blue-300 rounded w-16"></div>
                                        </div>
                                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                                            <div class="w-8 h-8 bg-purple-500 rounded-lg mb-2"></div>
                                            <div class="h-2 bg-purple-200 rounded w-12 mb-2"></div>
                                            <div class="h-4 bg-purple-300 rounded w-16"></div>
                                        </div>
                                        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                                            <div class="w-8 h-8 bg-green-500 rounded-lg mb-2"></div>
                                            <div class="h-2 bg-green-200 rounded w-12 mb-2"></div>
                                            <div class="h-4 bg-green-300 rounded w-16"></div>
                                        </div>
                                    </div>

                                    {/*  Mock table  */}
                                    <div class="space-y-2 pt-4">
                                        <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                            <div class="w-12 h-12 gradient-bg rounded-lg"></div>
                                            <div class="flex-1 space-y-2">
                                                <div class="h-3 bg-slate-200 rounded w-3/4"></div>
                                                <div class="h-2 bg-slate-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                            <div class="w-12 h-12 gradient-bg rounded-lg opacity-80"></div>
                                            <div class="flex-1 space-y-2">
                                                <div class="h-3 bg-slate-200 rounded w-3/4"></div>
                                                <div class="h-2 bg-slate-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                            <div class="w-12 h-12 gradient-bg rounded-lg opacity-60"></div>
                                            <div class="flex-1 space-y-2">
                                                <div class="h-3 bg-slate-200 rounded w-3/4"></div>
                                                <div class="h-2 bg-slate-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/*  Features Section  */}
            <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div class="max-w-7xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Todo lo que necesitas en un solo lugar
                        </h2>
                        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
                            Simplifica la gestión de tu negocio de videojuegos con herramientas potentes y fáciles de usar
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/*  Feature 1  */}
                        <div class="card-hover bg-white border border-slate-200 rounded-2xl p-6 hover:border-purple-200">
                            <div class="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 mb-2">Gestión completa</h3>
                            <p class="text-sm text-slate-600">Administra tu inventario de videojuegos con información detallada y actualizada</p>
                        </div>

                        {/* Feature 2  */}
                        <div class="card-hover bg-white border border-slate-200 rounded-2xl p-6 hover:border-purple-200">
                            <div class="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 mb-2">Ventas y alquileres</h3>
                            <p class="text-sm text-slate-600">Procesa transacciones de manera rápida y registra información de clientes</p>
                        </div>

                        {/*  Feature 3  */}
                        <div class="card-hover bg-white border border-slate-200 rounded-2xl p-6 hover:border-purple-200">
                            <div class="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 mb-2">Control de devoluciones</h3>
                            <p class="text-sm text-slate-600">Registra y gestiona devoluciones de alquileres de forma organizada</p>
                        </div>

                        {/*  Feature 4  */}
                        <div class="card-hover bg-white border border-slate-200 rounded-2xl p-6 hover:border-purple-200">
                            <div class="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 mb-2">Historial detallado</h3>
                            <p class="text-sm text-slate-600">Consulta el historial completo de todas tus transacciones realizadas</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* How it Works Section  */}
            <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Cómo funciona
                        </h2>
                        <p class="text-lg text-slate-600">
                            Comienza a gestionar tu negocio en tres simples pasos
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Step 1  */}
                        <div class="relative">
                            <div class="text-center">
                                <div class="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div class="absolute top-8 left-1/2 hidden md:block w-full h-0.5 bg-gradient-to-r from-purple-400 to-transparent" style={{ transform: "translateX(50%)" }}></div>
                                <h3 class="text-xl font-semibold text-slate-900 mb-3">Registra tus videojuegos</h3>
                                <p class="text-slate-600">Añade tu inventario con toda la información relevante de cada título</p>
                            </div>
                        </div>

                        {/* Step 2  */}
                        <div class="relative">
                            <div class="text-center">
                                <div class="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div class="absolute top-8 left-1/2 hidden md:block w-full h-0.5 bg-gradient-to-r from-purple-400 to-transparent" style={{ transform: "translateX(50%)" }}></div>
                                <h3 class="text-xl font-semibold text-slate-900 mb-3">Gestiona ventas y alquileres</h3>
                                <p class="text-slate-600">Procesa transacciones y registra información de clientes fácilmente</p>
                            </div>
                        </div>

                        {/*  Step 3  */}
                        <div class="relative">
                            <div class="text-center">
                                <div class="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 class="text-xl font-semibold text-slate-900 mb-3">Consulta historial</h3>
                                <p class="text-slate-600">Accede a reportes detallados y gestiona devoluciones sin complicaciones</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div class="max-w-4xl mx-auto">
                    <div class="gradient-bg rounded-3xl p-12 text-center shadow-2xl shadow-purple-500/30">
                        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
                            ¿Listo para empezar?
                        </h2>
                        <p class="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
                            Únete a GameHub y lleva la gestión de tu negocio de videojuegos al siguiente nivel
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <button class="px-8 py-4 text-base font-semibold text-purple-600 bg-white rounded-xl hover:bg-slate-50 transition duration-200 shadow-xl">
                                Crear cuenta gratis
                            </button>
                            <button class="px-8 py-4 text-base font-semibold text-white bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/30 transition duration-200">
                                Iniciar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer  */}
            <footer class="bg-slate-50 border-t border-slate-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 rounded-lg flex items-center justify-center">
                                <IoGameControllerOutline className="text-blue-700 text-2xl md:text-4xl" />

                            </div>
                            <span class="text-lg font-bold text-slate-800">GameHub</span>
                        </div>

                        <div class="flex items-center space-x-6">
                            <a href="#" class="text-sm text-slate-600 hover:text-slate-900 transition duration-200">Iniciar sesión</a>
                            <a href="#" class="text-sm text-slate-600 hover:text-slate-900 transition duration-200">Crear cuenta</a>
                        </div>

                        <div class="text-sm text-slate-500">
                            Creado por <span class="font-semibold text-slate-700">Ilson Diaz Morelo</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Welcome