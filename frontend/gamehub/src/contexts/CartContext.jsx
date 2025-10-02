import { createContext } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {


    const [games, setGames] = useState([]);

    const addGameToCart = (game) => {

        setGames((prevGames) => [...prevGames, game]);
    }

    const deleteGame = (GameId) => {

        const newGames = games.filter(game => game.id !== GameId);
        setGames(newGames);
    }

    const resetCart = () => setGames([]);


    return (
        <CartContext.Provider value={{ games, addGameToCart, resetCart, deleteGame }}>
            {children}
        </CartContext.Provider>
    )

}
