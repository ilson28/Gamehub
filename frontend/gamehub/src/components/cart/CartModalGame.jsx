import { MdPersonOutline } from "react-icons/md"
import Modal from "../modal/Modal"
import { IoCartOutline, IoWarningSharp } from "react-icons/io5"
import { CgGames } from "react-icons/cg";
import { AiFillDollarCircle } from "react-icons/ai";
import ButtonCard from "../ButtonCard";
import useCartContext from "../../hooks/useCartContext";
import { VscLoading } from "react-icons/vsc";
import { IoIosInformationCircleOutline } from "react-icons/io";
import clsx from "clsx";
import TransactionInfo from "../TransactionInfo";
import ButtonsModalTransaction from "../ButtonsModalTransaction";

const CartModalGame = ({ cliente, onClick, loading }) => {

    const { typeOfTransaction, games, getGameQuantity, getTotalItem, calculateTotal } = useCartContext();

    return (
        <TransactionInfo
            title={"Confirmar Transacción"}
            cliente={cliente}
            typeOfTransaction={typeOfTransaction}
            games={games}
            getGameQuantity={getGameQuantity}
            getTotalItem={getTotalItem}
            totalTransaction={calculateTotal()}
            onClick={onClick}
            loading={loading}
        >
            <div className="m-5 rounded-md bg-yellow-50 p-5 flex gap-3 border-l-4 border-yellow-400">
                <IoWarningSharp className="text-yellow-400 text-4xl min-w-9" />
                <div className="text-yellow-600 ">Por favor verifica que toda la información sea correcta antes de confirmar la transacción.</div>
            </div>
            <ButtonsModalTransaction
                loading={loading}
                onClick={onClick}
            />
        </TransactionInfo>
    )
}

export default CartModalGame