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
            
            // Si el loginUser no lanza error, es exitoso: Llama al callback de navegación
            console.log('Login Exitoso: Usuario:', user.role);
            if (onLoginSuccess) {
                onLoginSuccess(user);
            }

        } catch (err) {
            // Captura errores del API (401, 500, etc.)
            const message = err.response?.data?.message || 'Error de conexión. Verifica que el API esté corriendo.';
            setError(message);
            console.error(err);

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