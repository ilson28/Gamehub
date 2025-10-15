import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {


    const [games, setGames] = useState([]);
    const [transJuegos, setTransJuegos] = useState([]);

    const [typeOfTransaction, setTypeOfTransaction] = useState('venta');

    const addGameToCart = (game, cant) => {

        const gameInCart = games.find(g => g.id === game.id);

        if (!gameInCart) {

            setGames((prevGames) => [...prevGames, game]);
            const transJuego = {
                gameId: game.id,
                cant: cant
            }
            setTransJuegos(prev => [...prev, transJuego]);

        }


    }

    const deleteGame = (GameId) => {

        const newGames = games.filter(game => game.id !== GameId);
        setGames(newGames);
    }

    const resetCart = () => setGames([]);


    return (
        <CartContext.Provider value={{ games, addGameToCart, resetCart, deleteGame, typeOfTransaction, setTypeOfTransaction, transJuegos }}>
            {children}
        </CartContext.Provider>
    )

}
