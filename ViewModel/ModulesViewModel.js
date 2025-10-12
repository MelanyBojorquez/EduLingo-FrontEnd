// viewmodels/ModulesViewModel.js
import { useState, useCallback } from 'react';
import api from '../services/api';
import { getToken } from '../services/AuthService';

export const useModulesViewModel = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Leer todos los cursos
    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const response = await api.get('/admin/courses', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourses(response.data.courses);
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError("Error al cargar cursos. Verifique el token de Admin.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Borrar un curso
    const deleteCourse = async (courseId) => {
        setIsLoading(true);
        try {
            const token = await getToken();
            await api.delete(`/admin/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Refrescar la lista tras el borrado exitoso
            await fetchCourses(); 
            return true;
        } catch (err) {
            setError("Error al eliminar el curso.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };
    
    // Nota: La lógica de edición será navegar a un formulario pre-llenado.

    return {
        courses,
        isLoading,
        error,
        fetchCourses,
        deleteCourse,
        // ... (añadir lógica para editar más tarde)
    };
};