import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api'; // Importa el cliente de Axios configurado

// Claves de AsyncStorage
const TOKEN_KEY = 'userToken';
const USER_DATA_KEY = 'currentUser';

export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);
// ------------------------------------------
// 1. FUNCIÓN DE LOGIN (Tu código original - sin cambios)
// ------------------------------------------
export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        
        const { token, user } = response.data;
        
        // Almacena el token y los datos del usuario para la persistencia de sesión
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

        return user; // Devuelve los datos del usuario al ViewModel
    } catch (error) {
        // Lanza el error para que el ViewModel pueda capturarlo y mostrarlo
        throw error;
    }
};

// ------------------------------------------
// 2. FUNCIÓN DE REGISTRO (Tu código original - con una pequeña mejora)
// ------------------------------------------
export const registerUser = async (userData) => {
    try {
        // Se le añade la cabecera para asegurar que FormData se envíe correctamente
        const response = await api.post('/register', userData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        const { token, user } = response.data;
        
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

        return user;
    } catch (error) {
        throw error;
    }
};

// ------------------------------------------
// 3. FUNCIÓN DE CIERRE DE SESIÓN (Tu código original - sin cambios)
// ------------------------------------------
export const logoutUser = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
};

// ------------------------------------------
// 4. FUNCIÓN PARA OBTENER LAS LECCIONES (Tu código original - sin cambios)
// ------------------------------------------
export const fetchLessons = async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    if (!token) {
        throw new Error('No hay token de autenticación.');
    }
    
    const response = await api.get('/lessons', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data.lessons;
};


// ------------------------------------------
// 5. --- ¡ÚNICA FUNCIÓN AÑADIDA! ---
// ------------------------------------------
// Esta función es necesaria para que la pantalla de perfil pueda
// recuperar los datos del usuario que ha iniciado sesión.
export const getUser = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Error obteniendo los datos del usuario", e);
        return null;
    }
};

