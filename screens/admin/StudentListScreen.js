import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import api from '../../services/api'; 
import { getToken } from '../../services/AuthService';
import Icon from 'react-native-vector-icons/Ionicons'; // Se añade para los íconos

const StudentListScreen = () => {
    // Tu lógica de estados y datos se mantiene intacta
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Tu función para obtener los datos se mantiene intacta
    const fetchStudents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const response = await api.get('/admin/students', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(response.data.students);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "No se pudo cargar la lista. Acceso denegado o error de red.";
            setError(errorMessage);
            Alert.alert("Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Se mejora visualmente el renderizado de cada alumno
    const renderStudentItem = ({ item }) => (
        <View style={styles.studentCard}>
            <Icon name="person-circle-outline" size={40} color="#5E35B1" style={styles.studentIcon} />
            <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentEmail}>{item.email}</Text>
                <Text style={styles.studentDetails}>Aprendiendo: {item.learning_language} (Nativo: {item.native_language})</Text>
            </View>
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
    
    return (
        <SafeAreaView style={styles.container}>
            {/* Se añade una cabecera más estilizada con botón de refrescar */}
            <View style={styles.header}>
                <Text style={styles.title}>Alumnos Inscritos</Text>
                <TouchableOpacity onPress={fetchStudents}>
                    <Icon name="refresh-outline" size={26} color="#5E35B1" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={students}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderStudentItem}
                // Se mejora el mensaje de lista vacía
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>No hay alumnos registrados.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

// Estilos combinados y mejorados
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    studentCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, alignItems: 'center', elevation: 2 },
    studentIcon: { marginRight: 15 },
    studentInfo: { flex: 1 },
    studentName: { fontSize: 18, fontWeight: 'bold', color: '#5E35B1' },
    studentEmail: { fontSize: 14, color: '#666', marginTop: 2 },
    studentDetails: { fontSize: 12, color: '#888', marginTop: 5, fontStyle: 'italic' },
    errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
    emptyText: { textAlign: 'center', color: '#666', fontSize: 16 }
});

export default StudentListScreen;