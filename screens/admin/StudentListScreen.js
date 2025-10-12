// screens/admin/StudentListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../../services/api'; // Importar cliente Axios
import { getToken } from '../../services/AuthService'; // Necesario para el token

const StudentListScreen = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lógica para consumir el API de la lista de alumnos
    const fetchStudents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await getToken();

            const response = await api.get('/admin/students', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStudents(response.data.students);

        } catch (err) {
            console.error("Error fetching students:", err);
            setError("No se pudo cargar la lista. Acceso denegado o error de red.");
            Alert.alert("Error", "No tienes permisos de administrador para ver la lista.");

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Componente para renderizar cada item de alumno
    const renderStudentItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>Correo: {item.email}</Text>
            <Text style={styles.details}>Aprendiendo: {item.learning_language} (Nativo: {item.native_language})</Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#5E35B1" />
                <Text style={{ marginTop: 10 }}>Cargando lista de alumnos...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Alumnos Inscritos</Text>
            <FlatList
                data={students}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderStudentItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay alumnos registrados.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    itemContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    name: { fontSize: 18, fontWeight: 'bold', color: '#5E35B1' },
    email: { fontSize: 14, color: '#666' },
    details: { fontSize: 12, color: '#888', marginTop: 5 },
    errorText: { color: 'red', fontSize: 16 },
    emptyText: { textAlign: 'center', marginTop: 30, color: '#666' }
});

export default StudentListScreen;