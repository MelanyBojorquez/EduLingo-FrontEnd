import { useState } from 'react';
import { loginUser } from '../services/AuthService'; 

export const useLoginViewModel = (onLoginSuccess) => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');

        if (!email || !password) {
            setError('Todos los campos son obligatorios.');
            setIsLoading(false);
            return;
        }

        try {
            const user = await loginUser(email, password);
            
            // Si el loginUser no lanza error, es exitoso
            console.log('Login Exitoso: Usuario:', user.role);
            if (onLoginSuccess) {
                onLoginSuccess(user);
            }

        } catch (err) {
            
            const status = err.response?.status;
            let friendlyMessage = '';

            if (status === 401) {
                // Error 401: Unauthorized (No autorizado) - Credenciales incorrectas
                friendlyMessage = '🔑 Usuario y/o contraseña equivocada. ¡Inténtalo de nuevo!';
            } else if (status === 409) {
                // Error 409: Conflict 
                friendlyMessage = '⚠️ El correo electrónico ya está en uso. Prueba Iniciar Sesión.';
            } else {
                // Otros errores 
                friendlyMessage = '🌐 No pudimos contactar al servidor. Verifica tu conexión de red o la IP del API.';
            }
            
            setError(friendlyMessage);
            console.error(`Fallo de autenticación (Status: ${status}):`, err);

        } finally {
            setIsLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        isLoading,
        error, 
        handleLogin,
        isPasswordVisible,
        togglePasswordVisibility,
    };
};