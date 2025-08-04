import { createContext, useState } from "react";


const ModalContext = createContext();

const ModalProvider = ({ children }) => {

    const [state, setState] = useState(false);

    return (
        <ModalContext.Provider value={{ state, setState }}>
            {children}
        </ModalContext.Provider>
    );
}

export { ModalContext, ModalProvider };