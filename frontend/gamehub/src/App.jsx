import './App.css'
import { ModalProvider } from './contexts/modalContext';
import { CartContextProvider } from './contexts/CartContext';
import AppRouter from './AppRouter';
import { AuthContextProvider } from './contexts/AuthContext';



function App() {


  return (
    <div className='font-roboto bg-gray-50 min-h-screen'>

      <ModalProvider>
        <AuthContextProvider>

          <CartContextProvider>

            <AppRouter />

          </CartContextProvider>
        </AuthContextProvider>
      </ModalProvider>

    </div>
  )
}

export default App
