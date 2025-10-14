import { useState, useEffect } from 'react';
import api from '../services/api'; 
import { getToken } from '../services/AuthService';

export const useCourseEditViewModel = (courseId, navigation) => {
    // ----------------------------------------------------
    // DECLARACIÓN DE ESTADOS (SOLO AQUÍ)
    // ----------------------------------------------------
    const [category, setCategory] = useState('Gramática');
    const [title, setTitle] = useState(''); 
    const [targetLanguage, setTargetLanguage] = useState('Ingles'); 
    const [objectives, setObjectives] = useState(''); 
    
    // 🚨 ESTADO DE LECCIONES INICIALIZADO DE FORMA SEGURA Y CON CAMPOS COMPLETOS
    const [lessons, setLessons] = useState([{
        lessonTitle: 'Lección 1',
        type: 'Video',
        url: '',
        development: '', // Nuevo campo para el desarrollo de la lección
        content: ''
    }]); 
    
    const [isLoading, setIsLoading] = useState(true); 
    const [message, setMessage] = useState(''); 
    const [isEditing, setIsEditing] = useState(false); 

    // ----------------------------------------------------
    // LÓGICA DE MANEJO DE ESTADOS Y API
    // ----------------------------------------------------
    
    // Lógica para añadir lecciones
    const addLesson = () => { 
        setLessons([ 
            ...lessons,  
            { 
                lessonTitle: `Lección ${lessons.length + 1}`, 
                type: 'Video', 
                url: '', 
                development: '', 
                content: '' 
            } 
        ]); 
    }; 

    // Lógica para actualizar campos de una lección
    const updateLesson = (index, key, value) => { 
        const newLessons = [...lessons]; 
        newLessons[index][key] = value; 
        setLessons(newLessons); 
    }; 
    
    // Lógica para eliminar una lección
    const removeLesson = (indexToRemove) => {
        setLessons(lessons.filter((_, index) => index !== indexToRemove));
    };

    // Función para cargar los datos del curso desde la API (GET)
    const fetchCourseDetails = async () => { 
        setIsLoading(true);
        setMessage('');
        try { 
            const token = await getToken(); 
            const response = await api.get(`/admin/courses/${courseId}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            }); 

            const course = response.data.course; 
            
            // 1. Llenar estados principales
            setCategory(course.category || 'Gramática');
            setTitle(course.title); 
            setTargetLanguage(course.target_language); 
            setObjectives(course.objectives); 
            
            // 2. Manejo y parseo seguro de las lecciones
            let lessonsArray = [];
            const rawContent = course.content_json;
            
            if (rawContent) {
                try {
                    const parsedContent = JSON.parse(rawContent);
                    // Asumimos que el array está en la clave 'lessons' (o 'lecciones'/'courses')
                    lessonsArray = parsedContent.lessons || parsedContent.courses || parsedContent.lecciones || [];
                    
                } catch (e) {
                    console.error("Error al parsear el JSON de lecciones:", e);
                }
            }

            // 3. Establecer lecciones (si está vacío, usar el array inicial de una lección)
            setLessons(lessonsArray.length > 0 ? lessonsArray : [{ 
                lessonTitle: 'Lección 1', 
                type: 'Video', url: '', 
                development: '',
                content: ''
            }]);
            
        } catch (error) { 
            const errorMessage = error.response?.data?.message || 'Verifique la conexión o el ID del curso.';
            setMessage(`❌ Error al cargar curso: ${errorMessage}`); 
        } finally { 
            setIsLoading(false); 
        } 
    }; 

    // Función para enviar los datos actualizados a la API (PUT)
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
                category,
                title, 
                target_language: targetLanguage, 
                objectives, 
                lessons: lessons,  // El backend lo convierte a JSON
            }; 
            
            await api.put(`/admin/courses/${courseId}`, payload, { 
                headers: { Authorization: `Bearer ${token}` } 
            }); 

            setMessage(`✅ Curso ID ${courseId} actualizado exitosamente.`); 
            
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

    // ----------------------------------------------------
    // EFECTOS (CARGA INICIAL)
    // ----------------------------------------------------
    useEffect(() => { 
        if (courseId) { 
            fetchCourseDetails(); 
        } 
    }, [courseId]); 

    // ----------------------------------------------------
    //  RETORNO DE PROPIEDADES (FIN DEL HOOK)
    // ----------------------------------------------------
    return { 
        category, setCategory,
        title, setTitle, 
        targetLanguage, setTargetLanguage, 
        objectives, setObjectives, 
        lessons, addLesson, updateLesson, removeLesson, // 🚨 Todas las funciones de lección
        isLoading, isEditing, message, 
        updateCourse,
    }; 
};