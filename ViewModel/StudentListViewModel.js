import { useState, useEffect } from 'react';
import api from '../services/api';
import { getToken } from '../services/AuthService';

export const useStudentListViewModel = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            const response = await api.get('/admin/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data.students);
        } catch (err) {
            setError('No se pudo cargar la lista de alumnos.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return { students, isLoading, error, fetchStudents };
};
