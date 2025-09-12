import axios from 'axios';
const API_URL = 'http://localhost:8080/api/videojuegos';

export const createGame = async (game, imagen) => {

    const formData = new FormData();
    formData.append('videoJuegoDto', new Blob([JSON.stringify(game)], { type: 'application/json' }));
    formData.append('imagen', imagen);

    const response = await axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}

export const getGames = async () => {

    const response = await axios.get(API_URL);
    return response.data;

}

export const getGameById = async (id) => {

    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;

}

export const editGame = async (id, game, imagen = null) => {

    const formData = new FormData();
    formData.append('videoJuegoDto', new Blob([JSON.stringify(game)], { type: 'application/json' }));
    formData.append('imagen', imagen);

    const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}

export const getTotalGames = async () => {
    const response = await axios.get(`${API_URL}/total-videojuegos`);
    return response.data;
}

export const getTotalStock = async () => {
    const response = await axios.get(`${API_URL}/total-stock`);
    return response.data;
}