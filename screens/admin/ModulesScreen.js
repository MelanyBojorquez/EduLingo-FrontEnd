// screens/admin/ModulesScreen.js (Reemplaza el contenido de tu pestaña 'Modules')
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useModulesViewModel } from '../../ViewModel/ModulesViewModel';
import Icon from 'react-native-vector-icons/Ionicons';

const ModulesScreen = ({ navigation }) => {
    const { courses, isLoading, error, fetchCourses, deleteCourse } = useModulesViewModel();

    useEffect(() => {
        // Carga inicial y recarga al enfocarse en la pestaña
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCourses();
        });
        return unsubscribe;
    }, [navigation, fetchCourses]);

    // Lógica de confirmación de borrado
    const handleDelete = (courseId, courseTitle) => {
        Alert.alert(
            "Confirmar Eliminación",
            `¿Estás seguro de que deseas eliminar el curso: "${courseTitle}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        await deleteCourse(courseId);
                    }
                }
            ]
        );
    };

    const renderCourseItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.textGroup}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.language}>{item.target_language}</Text>
            </View>
            <View style={styles.buttonGroup}>
                <TouchableOpacity 
                    style={[styles.actionButton, {backgroundColor: '#5E35B1'}]}
                    onPress={() => navigation.navigate('CourseEdit', { courseId: item.id })} // Navegar a edición
                >
                    <Icon name="pencil" size={18} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.actionButton, {backgroundColor: '#DC3545'}]}
                    onPress={() => handleDelete(item.id, item.title)}
                >
                    <Icon name="trash" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (isLoading) {
        return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#5E35B1" /></View>;
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Gestión de Módulos Creados ({courses.length})</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCourseItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay cursos disponibles. Crea uno primero.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
    textGroup: { flex: 1, marginRight: 10 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#5E35B1' },
    language: { fontSize: 14, color: '#666' },
    buttonGroup: { flexDirection: 'row', width: 90, justifyContent: 'space-between' },
    actionButton: { padding: 8, borderRadius: 5 },
    errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
    emptyText: { textAlign: 'center', marginTop: 30, color: '#666' }
});

export default ModulesScreen;