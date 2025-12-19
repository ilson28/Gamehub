
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddGame from './pages/AddGame'
import Home from './pages/Home'
import History from './pages/History';
import Cart from './pages/Cart';
import Returns from './pages/Returns';
import Welcome from "./pages/Welcome";
import LayoutWithHeader from "./layout/LayoutWithHeader";
import LayoutWithoutHeader from "./layout/LayoutWithoutHeader";
import Login from "./pages/Login";
import PrivateGuard from "./guards/PrivateGuard";
import NotFound from "./pages/NotFound";

const AppRouter = () => {
    return (
        <BrowserRouter>

            <Routes>
                {/*  RUTAS PRIVADAS */}
                <Route element={<PrivateGuard />}>
                    <Route element={<LayoutWithHeader />}>
                        <Route path="/" element={<Navigate to={"/home"} />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/add-game" element={<AddGame />} />
                        <Route path="/add-game/:gameId" element={<AddGame />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path='/returns' element={<Returns />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/*  RUTAS PÚBLICAS */}
                <Route element={<LayoutWithoutHeader />}>
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                </Route>
            </Routes>

        </BrowserRouter >
    )
}

export default AppRouter;