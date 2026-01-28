import api from "./api";
const BASE_PATH = '/api/auth';

const login = async (username, password) => {

    const response = await api.post(`${BASE_PATH}/login`, { username, password });
    return response.data;
}
export { login };