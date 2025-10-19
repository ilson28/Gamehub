import { useContext } from "react";
import { ModalContext } from "../contexts/modalContext";


const useModalContext = () => {

    const context = useContext(ModalContext);
    
    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }
    
    return context;

}

export default useModalContext;