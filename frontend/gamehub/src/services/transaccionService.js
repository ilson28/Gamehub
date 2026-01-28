import api from "./api";

const BASE_PATH = '/api/transacciones';

export const createTransaction = async (transaction) => {

    const response = await api.post(BASE_PATH, transaction);
    return response.data;
}

export const getTransactions = async () => {

    const response = await api.get(BASE_PATH);
    return response.data;
}

export const getTotalActiveTransaccions = async () => {

    const response = await api.get(`${BASE_PATH}/total-active-transaccions`);
    return response.data;
}

export const getTotalSalesToday = async () => {
    const response = await api.get(`${BASE_PATH}/total-sales-today`);
    return response.data;
}

export const getTransactionsForType = async (type, date) => {

    const url = date
        ? `${BASE_PATH}/type/${type}?fecha=${date}`
        : `${BASE_PATH}/type/${type}`;

    const response = await api.get(url);
    return response.data;

}

export const getRentalTransactions = async (estado, date) => {

    const url = !date ? `${BASE_PATH}/alquiler/${estado}` : `${BASE_PATH}/alquiler/${estado}?fecha=${date}`;

    const response = await api.get(url);
    return response.data;

}

export const deleteTransaction = async (id) => {
    const response = await api.delete(`${BASE_PATH}/${id}`);
    return response.data;
}