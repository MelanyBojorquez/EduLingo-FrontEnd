import { useState } from 'react';
import api from '../services/api'; 
import { getToken } from '../services/AuthService';

export const useModuleCreationViewModel = () => {
    // Datos del curso
    const [title, setTitle] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('Ingles');
    const [objectives, setObjectives] = useState('');
    
    // Array dinámico de lecciones (content_json)
    const [lessons, setLessons] = useState([{
        lessonTitle: 'Lección 1',
        type: 'Video',
        url: '', // URL o ID de YouTube/Video
        content: '' // Descripción/texto (opcional)
    }]);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Función para añadir una nueva lección
    const addLesson = () => {
        setLessons([
            ...lessons, 
            {
                lessonTitle: `Lección ${lessons.length + 1}`,
                type: 'Video', 
                url: '',
                content: ''
            }
        ]);
    };

    // Función para actualizar los campos de una lección específica
    const updateLesson = (index, key, value) => {
        const newLessons = [...lessons];
        newLessons[index][key] = value;
        setLessons(newLessons);
    };

    // Función principal para guardar el curso
    const createCourse = async () => {
        setIsLoading(true);
        setMessage('');

        if (!title || !objectives || lessons.some(l => !l.url)) {
            setMessage('Por favor, complete el título, objetivos, y todas las URLs de las lecciones.');
            setIsLoading(false);
            return;
        }

        try {
            const token = await getToken();
            const payload = {
                title,
                target_language: targetLanguage,
                objectives,
                lessons, // El backend lo convierte a JSON
            };

            const response = await api.post('/admin/courses', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`✅ ${response.data.message}`);
            // Limpiar formulario al éxito
            setTitle('');
            setObjectives('');
            setLessons([{ lessonTitle: 'Lección 1', type: 'Video', url: '', content: '' }]);

        } catch (error) {
      
        const statusCode = error.response?.status; // Captura 400, 401, 403, 500
        const errorMessage = error.response?.data?.message || 'Error de red o conexión.';
        
        console.error("DEBUG API STATUS:", statusCode); 
        console.error("DEBUG API MESSAGE:", errorMessage); 

        const msg = `${statusCode ? statusCode + ': ' : ''} ${errorMessage}`;
        setMessage(`❌ Error: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        title, setTitle,
        targetLanguage, setTargetLanguage,
        objectives, setObjectives,
        lessons, addLesson, updateLesson,
        isLoading, message, createCourse
    };
};