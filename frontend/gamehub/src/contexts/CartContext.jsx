import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {


    const [games, setGames] = useState([]);

    const [typeOfTransaction, setTypeOfTransaction] = useState('venta');

    const addGameToCart = (game) => {

        setGames((prevGames) => [...prevGames, game]);
    }

    const deleteGame = (GameId) => {

        const newGames = games.filter(game => game.id !== GameId);
        setGames(newGames);
    }

    const resetCart = () => setGames([]);


    return (
        <CartContext.Provider value={{ games, addGameToCart, resetCart, deleteGame, typeOfTransaction, setTypeOfTransaction }}>
            {children}
        </CartContext.Provider>
    )

}
