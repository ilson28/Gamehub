import { useContext } from "react"
import { CartContext } from "../contexts/CartContext";



const useCartContext = () => {

    const context = useContext(CartContext);

    if(!context) throw new Error("useCartContext must be used within a CartContextProvider");

    return context;
   
}

export default useCartContext;