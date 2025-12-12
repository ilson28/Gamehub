
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './layout/Header'
import AddGame from './pages/AddGame'
import Home from './pages/Home'
import History from './pages/History';
import Cart from './pages/Cart';
import Returns from './pages/Returns';
import Welcome from "./pages/Welcome";
import LayoutWithHeader from "./layout/LayoutWithHeader";
import LayoutWithoutHeader from "./layout/LayoutWithoutHeader";

const AppRouter = () => {
    return (
        <BrowserRouter>

            <Routes>
                {/* Rutas con Navbar */}
                <Route element={<LayoutWithHeader />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/add-game" element={<AddGame />} />
                    <Route path="/add-game/:gameId" element={<AddGame />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path='/returns' element={<Returns />} />
                    <Route path="*" element={<h1 className='my-20 text-3xl text-center font-bold text-gray-900'>404 Not Found</h1>} />
                </Route>

                {/* Rutas sin Navbar */}
                <Route element={<LayoutWithoutHeader />}>
                    <Route path="/" element={<Welcome />} />

                </Route>
            </Routes>

        </BrowserRouter>
    )
}

export default AppRouter;