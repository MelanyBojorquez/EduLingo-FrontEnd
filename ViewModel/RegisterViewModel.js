import { useState } from 'react';
import { Platform } from 'react-native';

// 1. IMPORTAMOS tu configuración central de la API.
import { BASE_URL } from '../config/api'; 

export const useRegisterViewModel = (onSuccess) => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. ELIMINAMOS la constante API_URL que yo había puesto. Ya no la necesitamos.

    const handleRegister = async (userData) => {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();

        formData.append('name', userData.name);
        formData.append('lastName', userData.lastName);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('gender', userData.gender);
        formData.append('native_language', 'Español');
        formData.append('learning_language', 'Ingles');

        if (userData.image) {
            const uri = userData.image;
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('profilePicture', { uri, name: filename, type });
        }

        try {
            // 3. USAMOS tu constante BASE_URL para construir la URL final.
            //    Como BASE_URL ya incluye '/api', solo añadimos '/register'.
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Algo salió mal');
            }

            if (onSuccess) {
                onSuccess(result.user);
            }

        } catch (err) {
            console.error('Error en el registro:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        name, setName,
        lastName, setLastName,
        email, setEmail,
        password, setPassword,
        gender, setGender,
        isLoading,
        error,
        handleRegister
    };
};

