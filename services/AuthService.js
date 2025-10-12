// services/AuthService.js
/*import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const TOKEN_KEY = 'userToken';
const USER_DATA_KEY = 'currentUser';

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        
        const { token, user } = response.data;
        
        // Persistencia de la sesión
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

        return user;
    } catch (error) {
        // Relanza el error para que el ViewModel lo maneje
        throw error;
    }
};

// Función de ejemplo para verificar la sesión al inicio de la app
export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);*/






import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api'; // Importa el cliente de Axios configurado

// Claves de AsyncStorage
const TOKEN_KEY = 'userToken';
const USER_DATA_KEY = 'currentUser';

export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);
// ------------------------------------------
// 1. FUNCIÓN DE LOGIN
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
// 2. FUNCIÓN DE REGISTRO
// ------------------------------------------
export const registerUser = async (userData) => {
    try {
        // Enviar todos los datos requeridos por el backend
        const response = await api.post('/register', userData);
        
        const { token, user } = response.data;
        
        // Almacena automáticamente el token tras el registro
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

        return user;
    } catch (error) {
        throw error;
    }
};

// ------------------------------------------
// 3. FUNCIÓN DE CIERRE DE SESIÓN
// ------------------------------------------
export const logoutUser = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
};

// ------------------------------------------
// 4. FUNCIÓN PARA OBTENER LAS LECCIONES (Ejemplo de ruta protegida)
// ------------------------------------------
export const fetchLessons = async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    if (!token) {
        throw new Error('No hay token de autenticación.');
    }
    
    // El interceptor de Axios es mejor, pero esta es la forma explícita de agregar el token
    const response = await api.get('/lessons', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data.lessons;
};