import { useState, useEffect } from 'react';
import api from '../services/api'; 
import { getToken } from '../services/AuthService';

export const useCourseEditViewModel = (courseId, navigation) => {
    // Estados para todos los campos del formulario, incluyendo la categoría
    const [category, setCategory] = useState('Gramática');
    const [title, setTitle] = useState(''); 
    const [targetLanguage, setTargetLanguage] = useState('Ingles'); 
    const [objectives, setObjectives] = useState(''); 
    const [lessons, setLessons] = useState([]); 
     
    const [isLoading, setIsLoading] = useState(true); 
    const [message, setMessage] = useState(''); 
    const [isEditing, setIsEditing] = useState(false); 

    // Función para cargar los datos del curso desde la API
    const fetchCourseDetails = async () => { 
         setIsLoading(true);
        setMessage('');
         try { 
             const token = await getToken(); 
             const response = await api.get(`/admin/courses/${courseId}`, { 
                 headers: { Authorization: `Bearer ${token}` } 
             }); 

             const course = response.data.course; 
             
            // Se llenan los estados con los datos obtenidos
            setCategory(course.category || 'Gramática');
            setTitle(course.title); 
            setTargetLanguage(course.target_language); 
            setObjectives(course.objectives); 
            
            // CORRECCIÓN: Se asegura de que 'content_json' se convierta de string a array
            if (course.content_json && typeof course.content_json === 'string') {
                try {
                    setLessons(JSON.parse(course.content_json));
                } catch (e) {
                    console.error("Error al parsear las lecciones JSON:", e);
                    setLessons([]);
                }
            } else {
                setLessons([]);
            }
             
         } catch (error) { 
             const errorMessage = error.response?.data?.message || 'Verifique la conexión o el ID del curso.';
             setMessage(`❌ Error al cargar curso: ${errorMessage}`); 
         } finally { 
             setIsLoading(false); 
         } 
     }; 

    // Función para enviar los datos actualizados a la API
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
                 lessons: lessons,  
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

    // Lógica para añadir y actualizar lecciones
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
        category, setCategory,
        title, setTitle, 
        targetLanguage, setTargetLanguage, 
        objectives, setObjectives, 
        lessons, addLesson, updateLesson, 
        isLoading, isEditing, message, updateCourse 
     }; 
};
