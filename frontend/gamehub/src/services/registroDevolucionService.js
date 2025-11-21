import axios from 'axios';
const API_URL = 'http://localhost:8080/api/registro-devoluciones';

const getFilterRegistroDevoluciones = async (cliente, fromDate, toDate) => {
    const params = new URLSearchParams();

    if (cliente) params.append("cliente", cliente);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
};

const getAll = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}

export { getAll, getFilterRegistroDevoluciones };
