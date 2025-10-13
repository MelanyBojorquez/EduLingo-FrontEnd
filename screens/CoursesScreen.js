import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Datos de Ejemplo ---
// Más adelante, estos se obtendrán de tu API.
const inProgressLessons = [
    { id: '1', name: 'Lección de Verbos', description: 'Aprende los verbos regulares e irregulares...', language: 'Español', progress: 0.6 },
    { id: '2', name: 'Introducción al Inglés', description: 'Conceptos básicos para empezar a hablar...', language: 'Inglés', progress: 0.3 },
];

const completedCourses = [
    { id: 'c1' }, { id: 'c2' }, { id: 'c3' }, { id: 'c4' },
];

// --- Componente para una Tarjeta de Lección ---
const LessonCard = ({ lesson }) => (
    <View style={styles.card}>
        <View style={styles.cardImagePlaceholder} />
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{lesson.name}</Text>
            <Text style={styles.cardDescription}>{lesson.description}</Text>
            <Text style={styles.cardLanguage}>Idioma: {lesson.language}</Text>
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${lesson.progress * 100}%` }]} />
            </View>
            <View style={styles.cardButtons}>
                <TouchableOpacity style={styles.enterButton}>
                    <Text style={styles.enterButtonText}>Ingresar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

// --- Pantalla Principal de Cursos ---
const CoursesScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Cabecera */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>EduLingo</Text>
                    <Text style={styles.headerSubtitle}>"Pequeños pasos, grandes conversaciones"</Text>
                </View>

                {/* Sección "En curso" */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>En curso</Text>
                    </View>
                    {inProgressLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} />)}
                </View>

                {/* Sección "Completados" */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>¡Completados! 🎉</Text>
                    </View>
                    <FlatList
                        data={completedCourses}
                        renderItem={({ item }) => <View style={styles.completedCard} />}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20 }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 28, fontWeight: 'bold' },
    headerSubtitle: { fontSize: 14, color: '#666' },
    section: { marginTop: 20 },
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
    progressBarBackground: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginTop: 8 },
    progressBarFill: { height: '100%', backgroundColor: '#5E35B1', borderRadius: 4 },
    cardButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    enterButton: { backgroundColor: '#5E35B1', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15 },
    enterButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    deleteButton: { backgroundColor: '#333', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15 },
    deleteButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    completedCard: { width: 120, height: 120, backgroundColor: '#e9e9e9', borderRadius: 15, marginRight: 15 },
});

export default CoursesScreen;
