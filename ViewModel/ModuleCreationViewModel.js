import { useState } from 'react';
import api from '../services/api'; 
import { getToken } from '../services/AuthService';

export const useModuleCreationViewModel = () => {
    
    // ----------------------------------------------------
    // 1. DECLARACIÓN ÚNICA DE ESTADOS
    // ----------------------------------------------------
    const [category, setCategory] = useState('Gramática'); 
    const [title, setTitle] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('Ingles');
    const [objectives, setObjectives] = useState('');
    
    // Estado consolidado para las lecciones con el nuevo campo 'development'
    const [lessons, setLessons] = useState([{
        lessonTitle: 'Lección 1',
        type: 'Video',
        url: '',
        development: '', // Campo para el desarrollo de la lección
        content: ''
    }]);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // ----------------------------------------------------
    // 2. LÓGICA DE MANEJO DE LECCIONES
    // ----------------------------------------------------

    const addLesson = () => {
        setLessons([
            ...lessons, 
            {
                lessonTitle: `Lección ${lessons.length + 1}`,
                type: 'Video', 
                url: '',
                development: '', // Incluir nuevo campo
                content: ''
            }
        ]);
    };

    const updateLesson = (index, key, value) => {
        const newLessons = [...lessons];
        newLessons[index][key] = value;
        setLessons(newLessons);
    };

    const removeLesson = (indexToRemove) => {
        setLessons(lessons.filter((_, index) => index !== indexToRemove));
    };
    
    // ----------------------------------------------------
    // 3. LÓGICA PRINCIPAL (CREACIÓN DE CURSO)
    // ----------------------------------------------------

    const createCourse = async () => {
        setIsLoading(true);
        setMessage('');

        // Validar que al menos una lección tenga URL si no queremos que sea estricto
        // Si queremos ser estrictos con la URL:
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
            // Limpiar formulario al éxito
            setTitle('');
            setObjectives('');
            setLessons([{ lessonTitle: 'Lección 1', type: 'Video', url: '', development: '', content: '' }]);

        } catch (error) {
            const statusCode = error.response?.status;
            const errorMessage = error.response?.data?.message || 'Error de red o conexión.';
            const msg = `${statusCode ? statusCode + ': ' : ''} ${errorMessage}`;
            setMessage(`❌ Error: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    // ----------------------------------------------------
    // RETORNO DE PROPIEDADES
    // ----------------------------------------------------
    return {
        category, setCategory,
        title, setTitle,
        targetLanguage, setTargetLanguage,
        objectives, setObjectives,
        lessons, addLesson, updateLesson, removeLesson, 
        isLoading, message, createCourse
    };
};