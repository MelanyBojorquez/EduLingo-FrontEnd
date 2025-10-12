import { useState } from 'react';
import { registerUser } from '../services/AuthService';

export const useRegisterViewModel = (onRegisterSuccess) => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState(''); 
    const [gender, setGender] = useState('Femenino');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Alumno'); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Simplificamos idiomas para el registro
    const native_language = 'Español';
    const learning_language = 'Ingles';

    const fullName = `${name} ${lastName}`.trim();

    const handleRegister = async () => {
        setIsLoading(true);
        setError('');

        if (!name || !email || !password || !role) {
            setError('Todos los campos son obligatorios.');
            setIsLoading(false);
            return;
        }

        try {
            const user = await registerUser({ 
                name: fullName, 
                email, 
                password, 
                native_language, 
                learning_language,
                role // Enviamos el rol seleccionado
            });
            
            console.log('Registro Exitoso. Rol:', user.role);
            if (onRegisterSuccess) {
                onRegisterSuccess(user);
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Error de conexión o email ya registrado.';
            setError(message);
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
        //role, setRole, 
        isLoading,
        error,
        handleRegister,
    };
};