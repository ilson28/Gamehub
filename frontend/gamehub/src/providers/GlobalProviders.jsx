import { AuthContextProvider } from "../contexts/AuthContext"
import { CartContextProvider } from "../contexts/CartContext"
import { ModalProvider } from "../contexts/modalContext"

const GlobalProviders = ({ children }) => {
    return (
        <ModalProvider>
            <AuthContextProvider>

                <CartContextProvider>

                    {children}

                </CartContextProvider>
            </AuthContextProvider>
        </ModalProvider>
    )
}

export default GlobalProviders