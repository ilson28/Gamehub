import axios from 'axios';
const API_URL = 'http://localhost:8080/api/registro-devoluciones';

// const getAll = async (cliente, fromDate, toDate) => {
//     const params = new URLSearchParams();

//     if (cliente) params.append("cliente", cliente);
//     if (fromDate) params.append("fromDate", fromDate);
//     if (toDate) params.append("toDate", toDate);

//     const response = await axios.get(`${API_URL}?${params.toString()}`);
//     return response.data;
// };
const getAll = async (cliente, fromDate, toDate, page=0) => {
   

    const response = await axios.get(`${API_URL}`,{
        params: {
            cliente,
            fromDate,
            toDate,
            size:2,
            page
        }
     });
    return response.data;
};



const create = async (registroDevolucion) => {
    const response = await axios.post(API_URL, registroDevolucion);
    return response.data;
}

export { getAll, create };
