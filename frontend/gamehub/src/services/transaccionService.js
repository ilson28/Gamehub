import axios from 'axios';
const API_URL = 'http://localhost:8080/api/transacciones';

export const getTotalActiveTransaccions = async () => {

    const response = await axios.get(`${API_URL}/total-active-transaccions`);
    return response.data;
}

export const getTotalSalesToday = async () => {
    const response = await axios.get(`${API_URL}/total-sales-today`);
    return response.data;
}

export const getTransactionsForType = async (type, date) => {

    const response = await axios.get(`${API_URL}/type/${type}/${date}`);
    return response.data;

}

export const getRentalTransactions = async (estado, date) => {

    const response = await axios.get(`${API_URL}/alquiler/${estado}/${date}`);
    return response.data;

}