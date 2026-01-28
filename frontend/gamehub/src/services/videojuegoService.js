import api from "./api";
const BASE_PATH = '/api/videojuegos';

export const createGame = async (game, imagen) => {

    const formData = new FormData();
    formData.append('videoJuegoDto', new Blob([JSON.stringify(game)], { type: 'application/json' }));
    formData.append('imagen', imagen);

    const response = await api.post(BASE_PATH, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}

export const getGames = async (titulo) => {

    const response = await api.get(BASE_PATH, {
        params: {
            titulo: titulo && titulo.trim() !== '' ? titulo : null
        }
    });
    return response.data;

}

export const getGameById = async (id) => {

    const response = await api.get(`${BASE_PATH}/${id}`);
    return response.data;

}

export const editGame = async (id, game, imagen = null) => {

    const formData = new FormData();
    formData.append('videoJuegoDto', new Blob([JSON.stringify(game)], { type: 'application/json' }));
    formData.append('imagen', imagen);

    const response = await api.put(`${BASE_PATH}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}

export const getTotalGames = async () => {
    const response = await api.get(`${BASE_PATH}/total-videojuegos`);
    return response.data;
}

export const getTotalStock = async () => {
    const response = await api.get(`${BASE_PATH}/total-stock`);
    return response.data;
}