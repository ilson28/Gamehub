import ButtonsModalTransaction from "./ButtonsModalTransaction";
import TransactionInfo from "./TransactionInfo"


const TransactionModalGame = ({
    transaction,
    onClick,
    loading,
}) => {


    const gamesInTransaction = transaction.transjuegos.map(t => t.juego);

    const getGameQuantity = (gameId) => {

        const transjuego = transaction.transjuegos.find(tj => tj.videoJuego.id === gameId);
        return transjuego.cant;
    }

    const getTotalItem = (gameId) => {

        const transjuego = transaction.transjuegos.find(tj => tj.videoJuego.id === gameId);
        return transjuego.total;
    }

    return (
        <TransactionInfo
            title={"Detalle de la Transacción"}
            cliente={transaction.cliente}
            typeOfTransaction={transaction.tipo}
            games={gamesInTransaction}
            getGameQuantity={getGameQuantity}
            getTotalItem={getTotalItem}
            onClick={onClick}
            totalTransaction={transaction.total}
            loading={loading}
            onClose={onClose}
        >
            <div className="flex flex-col gap-4 rounded-md bg-gray-100 m-5 p-5">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <IoIosInformationCircleOutline className="text-2xl text-blue-600" />
                    <h2>Información de la Transacción</h2>
                </div>
                <div className="flex flex-col gap-3 md:flex-row w-4/5 md:justify-between">
                    <div className="flex flex-col gap-1">
                        <span>Fecha y Hora</span>
                        <span className="text-gray-600">
                            {new Date(transaction.fechaTrans).toLocaleDateString()} {transaction.hora.slice(0, 5)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span>Fecha de Devolución</span>
                        <span className="text-gray-600">
                            {new Date(transaction.fechaDev).toLocaleDateString()}
                        </span>
                    </div>

                </div>
            </div>
            <ButtonsModalTransaction
                loading={loading}
                onClick={onClick}
                transactionState={transaction.estado}
            />
        </TransactionInfo>
    )
}

export default TransactionModalGame