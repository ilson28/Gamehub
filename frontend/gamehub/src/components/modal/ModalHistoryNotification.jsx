import clsx from "clsx";
import Modal from "./Modal"
import { FaCheck } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useModalContext from "../../hooks/useModalContext";
const ModalHistoryNotification = () => {

    const navigate = useNavigate();
    const { state, setState } = useModalContext();
    const [counter, setCounter] = useState(5);

    useEffect(() => {
        if (!state) return;

        const interval = setInterval(() => {
            setCounter(prev => prev - 1);
        }, 1000);


        return () => clearInterval(interval);
    }, [state])

    const closeModal = () => {
        setState(false);
        navigate("/returns");
    }

    useEffect(() => {

        if (counter === 0) {
            closeModal();
        }
    }, [counter, setCounter])

    return (
        <Modal>
            <div className="min-h-72 bg-white p-6 rounded-lg shadow-lg flex items-center justify-center">
                <div className="flex flex-col gap-5 items-center">

                    <div className="bg-green-100 rounded-full p-3 w-fit animate-bounce ">
                        <FaCheck className="text-green-700 text-3xl" />
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <p className="text-gray-900 text-2xl font-bold">¡Devolución realizada con éxito!</p>
                        <p className="text-gray-500">Serás redirigido a la vista de devoluciones en {counter} segundos...</p>
                    </div>
                    <div className="w-full">

                        <div className={clsx("h-2 rounded-md bg-linear-to-l from-blue-500 to-blue-800",
                            state && "animate-progress")}>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center cursor-pointer font-semibold">
                        <span
                            onClick={closeModal}
                            className="text-blue-600">
                            Ir ahora
                        </span>
                        <FaArrowRightLong className="text-blue-700" />
                    </div>
                </div>
            </div>

        </Modal >
    )
}

export default ModalHistoryNotification