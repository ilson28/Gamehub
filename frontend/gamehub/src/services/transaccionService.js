import axios from 'axios';
const API_URL = 'http://localhost:8080/api/transacciones';

export const createTransaction = async (transaction) => {

    const response = await axios.post(API_URL, transaction);
    return response.data;
}

export const getTransactions = async () => {

    const response = await axios.get(API_URL);
    return response.data;
}

export const getTotalActiveTransaccions = async () => {

    const response = await axios.get(`${API_URL}/total-active-transaccions`);
    return response.data;
}

export const getTotalSalesToday = async () => {
    const response = await axios.get(`${API_URL}/total-sales-today`);
    return response.data;
}

export const getTransactionsForType = async (type, date) => {

    const url = date
        ? `${API_URL}/type/${type}?fecha=${date}`
        : `${API_URL}/type/${type}`;

    const response = await axios.get(url);
    return response.data;

}

export const getRentalTransactions = async (estado, date) => {

    const url = !date ? `${API_URL}/alquiler/${estado}` : `${API_URL}/alquiler/${estado}?fecha=${date}`;

    const response = await axios.get(url);
    return response.data;

}

export const deleteTransaction = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
}