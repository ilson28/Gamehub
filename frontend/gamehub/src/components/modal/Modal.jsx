import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { useEffect } from "react";
import useModalContext from "../../hooks/useModalContext";



const Modal = ({ children }) => {

    const { state } = useModalContext();
    const modalRoot = document.getElementById("modal")

    useEffect(() => {
        state ? document.body.classList.add('overflow-hidden') :
            document.body.classList.remove('overflow-hidden');


        return () => document.body.classList.remove('overflow-hidden');

    }, [state]);

    return createPortal(
        <div className={twMerge(
            clsx("modal",
                state ? "opacity-100 pointer-events-auto scale-100 translate-y-0" : "-translate-y-4 opacity-0  pointer-events-none scale-0"
            )
        )
        }>
            {children}
        </div >

        , modalRoot)
}

export default Modal