import { VscLoading } from "react-icons/vsc";
import useModalContext from "../hooks/useModalContext";
import ButtonCard from "./ui/ButtonCard";


const ButtonsModalTransaction = ({
    onClick,
    loading,
    transactionState = "",
    typeOfTransaction = "",
}) => {

    const { setState } = useModalContext();
    return (
        <div className="m-6 flex flex-col sm:flex-row gap-2">
            <ButtonCard
                disabled={loading}
                onClick={() => setState(false)}
                className="w-full border border-gray-400 text-gray-700">
                Cancelar
            </ButtonCard>
            {
                ((typeOfTransaction == "alquiler" && transactionState !== "devuelto") || (!typeOfTransaction && !transactionState)) &&
                <ButtonCard
                    disabled={loading}
                    color="blue"
                    className="w-full"
                    onClick={onClick}
                >
                    {
                        loading ? (<div className="flex justify-center items-center gap-2">
                            <VscLoading className="animate-spin text-2xl" /> Cargando...
                        </div>)
                            :
                            (
                                transactionState ?
                                    "Realizar Devolucion" :
                                    "Confirmar transaccion"
                            )
                    }
                </ButtonCard>}
        </div>
    )
}

export default ButtonsModalTransaction