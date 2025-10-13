import { useState } from 'react'; // <-- ¡ESTA ES LA LÍNEA QUE FALTABA!
import api from '../services/api'; 
import { getToken } from '../services/AuthService';

export const useModuleCreationViewModel = () => {
    // El resto de tu código se mantiene exactamente igual
    const [category, setCategory] = useState('Gramática'); 
    const [title, setTitle] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('Ingles');
    const [objectives, setObjectives] = useState('');
    
    const [lessons, setLessons] = useState([{
        lessonTitle: 'Lección 1',
        type: 'Video',
        url: '',
        content: ''
    }]);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

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

    const updateLesson = (index, key, value) => {
        const newLessons = [...lessons];
        newLessons[index][key] = value;
        setLessons(newLessons);
    };

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
                category,
                title,
                target_language: targetLanguage,
                objectives,
                lessons,
            };

            const response = await api.post('/admin/courses', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`✅ ${response.data.message}`);
            setTitle('');
            setObjectives('');
            setLessons([{ lessonTitle: 'Lección 1', type: 'Video', url: '', content: '' }]);

        } catch (error) {
            const statusCode = error.response?.status;
            const errorMessage = error.response?.data?.message || 'Error de red o conexión.';
            const msg = `${statusCode ? statusCode + ': ' : ''} ${errorMessage}`;
            setMessage(`❌ Error: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        category, setCategory,
        title, setTitle,
        targetLanguage, setTargetLanguage,
        objectives, setObjectives,
        lessons, addLesson, updateLesson,
        isLoading, message, createCourse
    };
};
