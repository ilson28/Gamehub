import { useNavigate } from "react-router-dom";


const Welcome = () => {

    const navigate = useNavigate();
    return (
        <div className="bg-white text-gray-900 antialiased" >
            {/* <!-- Hero Section --> */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
                {/* <!-- Decorative background --> */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* <!-- Content --> */}
                        <div className="space-y-8 animate-fade-in-up">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Sistema Administrativo
                                </div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                                    Sistema de gestión de videojuegos
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                                    Plataforma interna para administrar inventario, ventas, alquileres y devoluciones.
                                </p>
                            </div>

                            <div className="flex">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5 cursor-pointer">
                                    <span className="relative z-10">Acceder al sistema</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        </div>

                        {/* <!-- Mockup --> */}
                        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 group-hover:shadow-3xl group-hover:-translate-y-1">
                                    {/* <!-- Mockup Header --> */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-32 bg-gray-300 rounded"></div>
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg"></div>
                                        </div>
                                    </div>

                                    {/* <!-- Mockup Content --> */}
                                    <div className="p-8 space-y-6">
                                        {/* <!-- Stats --> */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 space-y-2">
                                                <div className="h-2 w-12 bg-blue-300 rounded"></div>
                                                <div className="h-6 w-16 bg-blue-400 rounded"></div>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 space-y-2">
                                                <div className="h-2 w-12 bg-green-300 rounded"></div>
                                                <div className="h-6 w-16 bg-green-400 rounded"></div>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 space-y-2">
                                                <div className="h-2 w-12 bg-purple-300 rounded"></div>
                                                <div className="h-6 w-16 bg-purple-400 rounded"></div>
                                            </div>
                                        </div>

                                        {/* <!-- Table --> */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-2.5 w-3/4 bg-gray-300 rounded"></div>
                                                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-2.5 w-3/4 bg-gray-300 rounded"></div>
                                                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-2.5 w-3/4 bg-gray-300 rounded"></div>
                                                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* <!-- Features Section --> */}
            < section className="py-24 px-6 bg-white" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Funcionalidades principales</h2>
                        <p className="text-xl text-gray-600">Herramientas diseñadas para optimizar la gestión operativa</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* <!-- Card 1 --> */}
                        <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                                    <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de videojuegos</h3>
                                <p className="text-gray-600 leading-relaxed">Control completo del inventario y catálogo de productos</p>
                            </div>
                        </div>

                        {/* <!-- Card 2 --> */}
                        <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                                    <svg className="w-7 h-7 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Ventas y alquileres</h3>
                                <p className="text-gray-600 leading-relaxed">Procesamiento ágil de transacciones comerciales</p>
                            </div>
                        </div>

                        {/* <!-- Card 3 --> */}
                        <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                                    <svg className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Devoluciones</h3>
                                <p className="text-gray-600 leading-relaxed">Gestión eficiente del proceso de retorno</p>
                            </div>
                        </div>

                        {/* <!-- Card 4 --> */}
                        <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            <div className="relative">
                                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors duration-300">
                                    <svg className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Historial de transacciones</h3>
                                <p className="text-gray-600 leading-relaxed">Consulta y análisis detallado de operaciones</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* <!-- How it Works Section --> */}
            < section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white" >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Cómo funciona</h2>
                        <p className="text-xl text-gray-600">Flujo de trabajo simplificado</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* <!-- Step 1 --> */}
                        <div className="relative group text-center">
                            <div className="relative inline-block mb-8">
                                <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Acceso autorizado</h3>
                            <p className="text-gray-600 leading-relaxed">Ingresa con credenciales administrativas</p>
                        </div>

                        {/* <!-- Step 2 --> */}
                        <div className="relative group text-center">
                            <div className="relative inline-block mb-8">
                                <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Gestiona operaciones</h3>
                            <p className="text-gray-600 leading-relaxed">Administra inventario, ventas y alquileres</p>
                        </div>

                        {/* <!-- Step 3 --> */}
                        <div className="relative group text-center">
                            <div className="relative inline-block mb-8">
                                <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Consulta reportes</h3>
                            <p className="text-gray-600 leading-relaxed">Accede a historial y análisis completo</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* <!-- Footer --> */}
            < footer className="py-16 px-6 bg-gray-50 border-t border-gray-200" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-3">
                        <p className="text-sm text-gray-500 tracking-wide">Internal management system</p>
                        <p className="text-xs text-gray-400">Built by Ilson Díaz Morelo</p>
                    </div>
                </div>
            </footer >

        </div >
    )
}

export default Welcome