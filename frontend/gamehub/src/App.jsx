import './App.css'
import { ModalProvider } from './contexts/modalContext';
import { CartContextProvider } from './contexts/CartContext';
import AppRouter from './AppRouter';



function App() {


  return (
    <div className='font-roboto bg-gray-50 min-h-screen'>

      <ModalProvider>
        <CartContextProvider>

          <AppRouter />

        </CartContextProvider>
      </ModalProvider>

    </div>
  )
}

export default App
