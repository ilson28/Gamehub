
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './layout/Header'
import AddGame from './pages/AddGame'
import Home from './pages/Home'
import History from './pages/History';
import Cart from './pages/Cart';
import Returns from './pages/Returns';

const AppRouter = () => {
    return (
        <BrowserRouter>

            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-game" element={<AddGame />} />
                <Route path="/add-game/:gameId" element={<AddGame />} />
                <Route path="/history" element={<History />} />
                <Route path="/cart" element={<Cart />} />
                <Route path='/returns' element={<Returns />} />
                <Route path="*" element={<h1 className='my-20 text-3xl text-center font-bold text-gray-900'>404 Not Found</h1>} />
            </Routes>

        </BrowserRouter>
    )
}

export default AppRouter;