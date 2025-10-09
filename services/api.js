// Archivo: services/api.js
import axios from 'axios';
import { BASE_URL } from '../config/api';

// Cliente base de Axios
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;