import { createGame, editGame, getGameById } from "../services/videojuegoService";
import GameForm from "../components/GameForm";
import { useParams } from "react-router-dom";
import { useApiRequest } from "../hooks/useApiRequest";
import gta from "../assets/img/gta.jpg";

import { useEffect, useRef, useState } from "react";
import GameModal from "../components/GameModal";

import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/ErrorModal";
import useModalContext from "../components/modal/context/useModalContext";
import Modal from "../components/modal/Modal";

const AddGame = () => {

    const formRef = useRef(); //  ref para GameForm
    const [game, setGame] = useState(null); // Estado para almacenar el videojuego agregado
    const navigate = useNavigate();
    const { gameId } = useParams();
    const { setState } = useModalContext(); // Para manejar el estado del modal
    const { loading, error, sendRequest, clearError } = useApiRequest();// Hook personalizado para manejar peticiones http.

    const fetchGame = async (id) => {

        const response = await sendRequest(() => getGameById(id));
        if (response?.success) {
            formRef.current?.resetData(response.data); // Resetear el formulario con los datos del videojuego
            // console.log("Videojuego obtenido exitosamente", response.data);
        }

    }

    const handleCloseModal = () => {

        if (gameId) {
            navigate("/add-game"); // Cambia la URL para ir a modo crear
        }
        setGame(null);
        clearError(); // Limpiar el error si lo hay
        setState(false); // Cerrar el modal
    }


    useEffect(() => {
        if (gameId) {
            fetchGame(gameId);
        }
    }, [gameId]);

    useEffect(() => {
        if (error) setState(true); // Abrir el modal de error si hay un error

    }, [error])


    const onSubmit = async (data) => {

        let response;
        const img = data.imagen;
        delete data.imagen; // Eliminar la propiedad imagen del objeto data

        // Si hay gameId, significa que estamos editando un videojuego existente
        gameId ? response = await sendRequest(() => editGame(gameId, data, img))
            : response = await sendRequest(() => createGame(data, img));


        if (response?.success) {

            const message = gameId ? `Videojuego editado exitosamente id:${gameId}` : "Videojuego agregado exitosamente";
            console.log(message, response.data);
            setGame(response.data); // Guardar el videojuego en el estado para mostrar en el modal
            formRef.current?.resetForm(); // Resetear el formulario después de agregar el videojuego
            setState(true); // Abrir el modal para mostrar el videojuego agregado
        }

    };


    return (
        <div className="container w-3/4">


            <div className="flex flex-col gap-3 p-4 shadow-lg bg-white rounded-lg mt-5 ">

                <h2 className='text-3xl font-bold text-gray-900'> {gameId ? "Editar" : "Agregar nuevo"} Videojuego</h2>
                <p className='text-gray-600'>Completa todos los campos para registrar un nuevo videojuego</p>
            </div>

            <div className="my-12 px-5 py-6 bg-white shadow-md rounded-lg ">

                <GameForm

                    mode={gameId ? "edit" : "create"}
                    onSubmit={onSubmit}
                    loading={loading}
                    ref={formRef} />

            </div>

            <Modal>
                {game && (
                    <GameModal
                        gameId={!!gameId}
                        game={game}
                        onClose={handleCloseModal}
                    />
                )}

                {error && !game && (
                    <ErrorModal
                        open={!!error}
                        onClose={handleCloseModal}
                    />
                )}
            </Modal>



        </div >
    )
}

export default AddGame