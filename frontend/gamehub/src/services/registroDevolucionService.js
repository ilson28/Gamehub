import api from "./api";
const BASE_PATH = '/api/registro-devoluciones';

// const getAll = async (cliente, fromDate, toDate) => {
//     const params = new URLSearchParams();

//     if (cliente) params.append("cliente", cliente);
//     if (fromDate) params.append("fromDate", fromDate);
//     if (toDate) params.append("toDate", toDate);

//     const response = await api.get(`${API_URL}?${params.toString()}`);
//     return response.data;
// };
const getAll = async (cedula, fromDate, toDate, page = 0) => {


    const response = await api.get(BASE_PATH, {
        params: {
            cedula,
            fromDate,
            toDate,
            size: 10,
            page
        }
    });
    return response.data;
};


const getTotalReturns = async () => {

    const response = await api.get(`${BASE_PATH}/total-devoluciones`);
    return response.data;
}
const getReturnsOfToday = async () => {

    const response = await api.get(`${BASE_PATH}/devoluciones-dia`);
    return response.data;
}


const getReturnsOfMonth = async () => {

    const response = await api.get(`${BASE_PATH}/devoluciones-mes`);
    return response.data;

}



const create = async (registroDevolucion) => {
    const response = await api.post(BASE_PATH, registroDevolucion);
    return response.data;
}

export { getAll, create, getReturnsOfMonth, getReturnsOfToday, getTotalReturns };
