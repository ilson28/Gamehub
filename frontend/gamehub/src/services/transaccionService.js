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