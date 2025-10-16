import React, { useState, useCallback } from 'react'; // <-- ¡LÍNEA CORREGIDA!
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { getMyCourses, unenrollFromCourse } from '../services/AuthService';

const LessonCard = ({ lesson, navigation, onDelete }) => (
    <View style={styles.card}>
        <View style={styles.cardImagePlaceholder} />
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{lesson.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>{lesson.objectives}</Text>
            <Text style={styles.cardLanguage}>Idioma: {lesson.target_language}</Text>
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${(lesson.progress || 0) * 100}%` }]} />
            </View>
            <View style={styles.cardButtons}>
                <TouchableOpacity 
                    style={styles.enterButton}
                    onPress={() => navigation.navigate('ModuleDetail', { module: lesson })}
                >
                    <Text style={styles.enterButtonText}>Ingresar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={() => onDelete(lesson.enrollment_id, lesson.title)}
                >
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

const CoursesScreen = ({ navigation }) => {
    const [myCourses, setMyCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Se usa useCallback para evitar que la función se recree innecesariamente
    const loadMyCourses = useCallback(async () => {
        try {
            // No se establece isLoading a true aquí para evitar parpadeos al refrescar
            setError(null);
            const courses = await getMyCourses();
            setMyCourses(courses);
        } catch (err) {
            setError("No se pudieron cargar tus cursos.");
            console.error("Error en loadMyCourses:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // useFocusEffect se ejecuta cada vez que el usuario entra en esta pantalla
    useFocusEffect(
      useCallback(() => {
        setIsLoading(true); // Poner el loader al entrar a la pantalla
        loadMyCourses();
        return () => {
          // Opcional: función de limpieza
        };
      }, [loadMyCourses])
    );

    const handleDelete = (enrollmentId, title) => {
        Alert.alert(
            "Eliminar Curso",
            `¿Estás seguro de que quieres eliminar "${title}" de tu lista?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await unenrollFromCourse(enrollmentId);
                            // Se filtran los cursos localmente para una respuesta visual instantánea
                            setMyCourses(prevCourses => prevCourses.filter(c => c.enrollment_id !== enrollmentId));
                        } catch (err) {
                            Alert.alert("Error", "No se pudo eliminar el curso.");
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#5E35B1" /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>EduLingo</Text>
                    <Text style={styles.headerSubtitle}>"Pequeños pasos, grandes conversaciones"</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>En curso</Text>
                    </View>
                    {error ? (
                        <Text style={styles.emptyText}>{error}</Text>
                    ) : myCourses.length > 0 ? (
                        myCourses.map(lesson => 
                            <LessonCard 
                                key={lesson.enrollment_id} 
                                lesson={lesson} 
                                navigation={navigation} 
                                onDelete={handleDelete} 
                            />
                        )
                    ) : (
                        <Text style={styles.emptyText}>No tienes cursos en progreso. ¡Inscríbete a uno en la pestaña de Inicio!</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    headerTitle: { fontSize: 28, fontWeight: 'bold' },
    headerSubtitle: { fontSize: 14, color: '#666' },
    section: { marginTop: 10 },
    sectionHeader: { backgroundColor: '#F3E5F5', paddingVertical: 12, paddingHorizontal: 20, marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardImagePlaceholder: { width: 80, height: 80, backgroundColor: '#e9e9e9', borderRadius: 10 },
    cardContent: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    cardDescription: { fontSize: 12, color: '#666', marginVertical: 4 },
    cardLanguage: { fontSize: 12, color: '#888' },
    progressBarBackground: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginTop: 8, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: '#5E35B1', borderRadius: 4 },
    cardButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    enterButton: { backgroundColor: '#5E35B1', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15 },
    enterButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    deleteButton: { backgroundColor: '#333', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15 },
    deleteButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', margin: 20, color: '#666', fontSize: 16 },
});

export default CoursesScreen;
