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

    const calculateTotal = () => {
        return games.reduce((total, game) => {

            const transjuego = transJuegos.find(g => g.gameId === game.id);
            const cant = transjuego.cant || 1;
            const price = (typeOfTransaction === 'venta' ? game.precioVenta : game.precioAlquiler) * cant;
            return total + price;
        }, 0);
    }

    const deleteGame = (GameId) => {

        const newGames = games.filter(game => game.id !== GameId);
        setGames(newGames);
    }

    const resetCart = () => setGames([]);


    return (
        <CartContext.Provider value={{ games, addGameToCart, resetCart, deleteGame, calculateTotal, typeOfTransaction, setTypeOfTransaction, transJuegos }}>
            {children}
        </CartContext.Provider>
    )

}
