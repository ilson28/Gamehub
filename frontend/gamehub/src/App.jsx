import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './layout/Header'
import AddGame from './pages/AddGame'
import Home from './pages/Home'
import History from './pages/History';
import { ModalProvider } from './contexts/modalContext';
import { CartContextProvider } from './contexts/CartContext';
import Cart from './pages/Cart';
import Returns from './pages/Returns';


function App() {


  return (
    <div className='font-roboto bg-gray-50 min-h-screen'>

      <ModalProvider>
        <CartContextProvider>

          <BrowserRouter>

            <Header />

            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/add-game" element={<AddGame />} />
              <Route path="/add-game/:gameId" element={<AddGame />} />
              <Route path="/history" element={<History />} />
              <Route path="/cart" element={<Cart />} />
              <Route path='/returns' element={<Returns />} />


              {/**
           * Ruta de error 404
           * 
           * Esta ruta actúa como un "fallback" para manejar URLs no reconocidas en la aplicación.
           * 
           * - `path="*"`: Coincide con cualquier ruta que no haya sido definida previamente.
           * - `element`: Renderiza un encabezado `<h1>` con un mensaje de error.
           * 
           * Ejemplo de uso:
           * Si el usuario navega a una URL como `/ruta-inexistente`, verá el mensaje "404 Not Found".
           */}
              <Route path="*" element={<h1 className='my-20 text-3xl text-center font-bold text-gray-900'>404 Not Found</h1>} />
            </Routes>

          </BrowserRouter>

        </CartContextProvider>
      </ModalProvider>

    </div>
  )
}

export default App
