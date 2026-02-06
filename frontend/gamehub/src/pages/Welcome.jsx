import { useNavigate } from "react-router-dom";

export default function Welcome() {

    const navigate = useNavigate();
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col animate-fade-in-up">
            {/* ======================================================
          HERO / ZONA PRINCIPAL
          ====================================================== */}
            <section className="flex flex-1 items-center px-10 py-16 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full">

                    {/* ---------- TEXTO PRINCIPAL ---------- */}
                    <div className="flex flex-col justify-center">
                        <span className="text-sm font-semibold text-blue-600 tracking-wide mb-4">
                            SISTEMA ADMINISTRATIVO
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Control total sobre inventario,
                            <br />
                            ventas y alquileres.
                        </h1>

                        <p className="mt-6 text-slate-600 text-lg max-w-xl">
                            Un panel diseñado para administrar productos,
                            movimientos y decisiones sin ruido visual ni pasos innecesarios.
                        </p>

                        <div className="mt-10">
                            <button
                                className=" bg-blue-600  hover:bg-blue-700 transition-colors text-white px-8 py-3 rounded-lg font-semibold shadow-md cursor-pointer"
                                onClick={() => navigate("/login")}
                            >
                                Acceder al panel
                            </button>
                        </div>
                    </div>

                    {/* ---------- METÁFORA VISUAL: PANEL ---------- */}
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6">
                        {/* Header del panel */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold text-slate-800">
                                Estado general del sistema
                            </h2>
                            <span className="text-xs text-slate-400">
                                Actualizado hoy
                            </span>
                        </div>

                        {/* Bloques de estado */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <StatusCard
                                title="Productos"
                                value="128"
                                status="ok"
                            />
                            <StatusCard
                                title="Alquileres activos"
                                value="14"
                                status="warning"
                            />
                            <StatusCard
                                title="Ventas del día"
                                value="$2.450"
                                status="danger"
                            />
                        </div>

                        {/* Tabla simulada */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-3 bg-slate-100 text-xs font-semibold text-slate-600 px-4 py-2">
                                <span>Producto</span>
                                <span>Estado</span>
                                <span>Stock</span>
                            </div>

                            <Row name="PlayStation 5" status="Disponible" stock="12" />
                            <Row name="Xbox Series X" status="Alquilado" stock="3" />
                            <Row name="Nintendo Switch" status="Bajo" stock="2" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ======================================================
          SECCIÓN INFERIOR: PROPÓSITO DEL SISTEMA
          ====================================================== */}
            <section className="bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

                    <Feature
                        title="Diseño claro"
                        description="Cada acción es visible, directa y sin distracciones innecesarias."
                    />

                    <Feature
                        title="Control centralizado"
                        description="Inventario, ventas y alquileres gestionados desde un solo lugar."
                    />

                    <Feature
                        title="Enfoque administrativo"
                        description="Pensado para decisiones reales, no solo para verse bien."
                    />
                </div>
            </section>
        </main>
    );
}

/* ==========================================================
   COMPONENTES AUXILIARES
   ========================================================== */

/**
 * Tarjeta de estado visual
 * Cambia de color según el estado
 */
function StatusCard({ title, value, status }) {
    const statusStyles = {
        ok: "bg-emerald-50 text-emerald-700",
        warning: "bg-amber-50 text-amber-700",
        danger: "bg-red-50 text-red-700",
    };

    return (
        <div className={`rounded-lg p-4 ${statusStyles[status]}`}>
            <p className="text-xs font-semibold mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}

/**
 * Fila simulada de tabla
 */
function Row({ name, status, stock }) {
    return (
        <div className="grid grid-cols-3 px-4 py-3 text-sm border-t border-slate-200">
            <span className="text-slate-800">{name}</span>
            <span className="text-slate-600">{status}</span>
            <span className="text-slate-600">{stock}</span>
        </div>
    );
}

/**
 * Bloque de característica
 */
function Feature({ title, description }) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {title}
            </h3>
            <p className="text-slate-600">
                {description}
            </p>
        </div>
    );
}
