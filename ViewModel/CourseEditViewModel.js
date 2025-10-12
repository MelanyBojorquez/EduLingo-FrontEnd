
import { useState, useEffect } from 'react';
import api from '../services/api'; 
import { getToken } from '../services/AuthService';

export const useCourseEditViewModel = (courseId, navigation) => {
    // Estados iniciales del curso (similares a ModuleCreationViewModel)
    const [title, setTitle] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('Ingles');
    const [objectives, setObjectives] = useState('');
    const [lessons, setLessons] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Función para cargar los datos del curso (GET)
    const fetchCourseDetails = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await api.get(`/admin/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const course = response.data.course;
            
            // Llenar los estados con los datos del curso
            setTitle(course.title);
            setTargetLanguage(course.target_language);
            setObjectives(course.objectives);
            setLessons(course.content_json?.lecciones || []); 
            
        } catch (error) {
            setMessage(`❌ Error al cargar curso: ${error.response?.data?.message || 'Verifique la conexión.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para actualizar el curso (PUT)
    const updateCourse = async () => {
        setIsEditing(true);
        setMessage('');

        if (!title || !objectives || lessons.length === 0) {
            setMessage('Por favor, complete el título, objetivos y lecciones.');
            setIsEditing(false);
            return;
        }

        try {
            const token = await getToken();
            const payload = {
                title,
                target_language: targetLanguage,
                objectives,
                // Envolvemos las lecciones en un objeto JSON compatible con el backend
                lessons: lessons, 
            };
            
            // Llamada PUT al endpoint de actualización
            await api.put(`/admin/courses/${courseId}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`✅ Curso ID ${courseId} actualizado exitosamente.`);
            
            // Opcional: Navegar de vuelta a la lista principal después de un breve retraso
            setTimeout(() => {
                navigation.goBack(); 
            }, 1500);

        } catch (error) {
            const msg = error.response?.data?.message || 'Error al guardar los cambios.';
            setMessage(`❌ Error: ${msg}`);
        } finally {
            setIsEditing(false);
        }
    };

    // Lógica para añadir/actualizar lecciones (copiada del ModuleCreationViewModel)
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

    // Cargar detalles al inicio
    useEffect(() => {
        if (courseId) {
            fetchCourseDetails();
        }
    }, [courseId]);

    return {
        title, setTitle,
        targetLanguage, setTargetLanguage,
        objectives, setObjectives,
        lessons, addLesson, updateLesson,
        isLoading, isEditing, message, updateCourse
    };
};