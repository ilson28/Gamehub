import { createGame, editGame, getGameById } from "../services/videojuegoService";
import GameForm from "../components/games/GameForm";
import { useParams, useNavigate } from "react-router-dom";
// import gta from "../assets/img/gta.jpg";
import { useEffect, useRef, useState } from "react";
import GameModal from "../components/games/GameModal";
import ErrorModal from "../components/modal/ErrorModal";
import Modal from "../components/modal/Modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useModalContext from "../hooks/useModalContext";
import useCartContext from "../hooks/useCartContext";

const AddGame = () => {
    const formRef = useRef();
    const [game, setGame] = useState(null);
    const navigate = useNavigate();
    const { gameId } = useParams();
    const { setState } = useModalContext();
    const queryClient = useQueryClient();
    const { games, setGames } = useCartContext();

    // Obtener videojuego si estamos en modo edición
    const { data: gameData, isLoading: loadingGame } = useQuery({
        queryKey: ["game", gameId],
        queryFn: () => getGameById(gameId),
        enabled: !!gameId,
        staleTime: 1000 * 60 * 60 * 2 // 2 horas

    });

    // Mutación para crear/editar videojuego
    const mutation = useMutation({
        mutationFn: ({ id, data, img }) => {
            return id ? editGame(id, data, img) : createGame(data, img);
        },
        onSuccess: (response) => {
            // const message = gameId
            //     ? `Videojuego editado exitosamente id:${gameId}`
            //     : "Videojuego agregado exitosamente";
            // console.log(message, response.data);

            setGame(response.data);
            setState(true);
            queryClient.invalidateQueries(["games", "totalStock", "totalGames"]);
            if (gameId && games?.length > 0) {
                const updatedGames = games.map(g => g.id === response.data.id ? response.data : g);
                setGames(updatedGames);
            }
        }
    });

    // Prellenar formulario en modo edición
    useEffect(() => {
        if (gameData?.success) {
            formRef.current?.resetData(gameData.data);
        }
    }, [gameData]);

    const handleCloseModal = () => {

        formRef.current?.resetForm();
        if (gameId) {
            navigate("/add-game");
        }
        setGame(null);
        setState(false);
    };

    const onSubmit = (data) => {
        const img = data.imagen;
        delete data.imagen;
        mutation.mutate({ id: gameId, data, img });
    };

    return (
        <div className="container w-3/4 min-h-screen">
            <div className="flex flex-col gap-3 p-4 shadow-lg bg-white rounded-lg mt-5">
                <h2 className='text-3xl font-bold text-gray-900'>
                    {gameId ? "Editar" : "Agregar nuevo"} Videojuego
                </h2>
                <p className='text-gray-600'>Completa todos los campos para registrar un nuevo videojuego</p>
            </div>

            <div className="my-12 px-5 py-6 bg-white shadow-md rounded-lg">
                <GameForm
                    mode={gameId ? "edit" : "create"}
                    onSubmit={onSubmit}
                    loading={loadingGame || mutation.isPending}
                    ref={formRef}
                />
            </div>

            <Modal>
                {game && (
                    <GameModal
                        gameId={!!gameId}
                        game={game}
                        onClose={handleCloseModal}
                    />
                )}

                {mutation.isError && !game && (
                    <ErrorModal
                        open={!!mutation.error}
                        onClose={handleCloseModal}
                    />
                )}
            </Modal>
        </div>
    );
};

export default AddGame;
