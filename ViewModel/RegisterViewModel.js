import { useState } from 'react';
import { Platform } from 'react-native';

// Importamos la configuración central de la API.
import { BASE_URL } from '../config/api'; 

export const useRegisterViewModel = (onSuccess) => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (userData) => {
        setIsLoading(true);
        setError(null);

        // Validaciones básicas (Aseguramos que los campos esenciales no estén vacíos)
        if (!userData.name || !userData.lastName || !userData.email || !userData.password) {
            setError('Todos los campos son obligatorios.');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        const fullName = `${userData.name} ${userData.lastName}`.trim();

        // Campos de texto
        formData.append('name', fullName);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('gender', userData.gender);
        formData.append('native_language', 'Español'); 
        formData.append('learning_language', 'Ingles'); 
        formData.append('role', 'Alumno'); 

        if (userData.image) {
            const uri = userData.image;
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('profilePicture', { uri, name: filename, type });
        }

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                // Fetch automáticamente configura Content-Type: multipart/form-data para FormData
                body: formData,
            });

            // Manejo de la Respuesta HTTP 
            if (response.status === 409) {
                 // Error 409: Conflict (Correo ya existe)
                throw new Error('409: ¡Ya existe una cuenta con ese correo! Por favor, inicia sesión.');
            }
            
            // Intentar leer el JSON incluso si hay otros errores 4xx/5xx
            const result = await response.json(); 

            if (!response.ok) {
                 // Captura cualquier otro error del servidor (ej. 400 Bad Request o 500 Internal Error)
                throw new Error(`${response.status}: ${result.message || 'Algo salió mal durante el registro.'}`);
            }

            // Éxito:
            if (onSuccess) {
                onSuccess(result.user); 
            }

        } catch (err) {
            const message = err.message || 'Error de conexión.';
            let friendlyMessage = '';
            
            if (message.includes('409')) {
                friendlyMessage = '🚫 ¡Ya existe una cuenta con ese correo! Por favor, inicia sesión.';
            } else if (message.includes('400')) {
                friendlyMessage = '⚠️ Datos incompletos. Revisa que llenaste todos los campos.';
            } else if (message.includes('Network request failed') || message.includes('Error de conexión')) {
                friendlyMessage = '🌐 Error de conexión. Verifica la IP del API o tu red.';
            } else {
                friendlyMessage = '❌ Error desconocido. No se pudo completar el registro.';
            }
            
            console.error('Error en el registro:', err);
            setError(friendlyMessage);
            
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