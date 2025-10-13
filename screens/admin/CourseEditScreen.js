import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCourseEditViewModel } from '../../ViewModel/CourseEditViewModel'; 

const CourseEditScreen = ({ route, navigation }) => {
    const { courseId } = route.params; 

    // Se importa la categoría y su función para actualizarla
    const {
        category, setCategory,
        title, setTitle, targetLanguage, setTargetLanguage, objectives, setObjectives,
        lessons, addLesson, updateLesson,
        isLoading, isEditing, message, updateCourse
    } = useCourseEditViewModel(courseId, navigation);

    // Tu función para renderizar las lecciones
    const renderLessonInput = (lesson, index) => (
        <View key={index} style={styles.lessonCard}>
            <Text style={styles.lessonHeader}>{lesson.lessonTitle || `Lección ${index + 1}`}</Text>
            <Text style={styles.inputLabel}>URL de Video (YouTube/Embed):</Text>
            <TextInput
                style={styles.input}
                placeholder="https://youtube.com/..."
                value={lesson.url}
                onChangeText={(text) => updateLesson(index, 'url', text)}
            />
            <Text style={styles.inputLabel}>Contenido/Descripción (Opcional):</Text>
            <TextInput
                style={styles.inputArea}
                placeholder="Breve explicación de la lección"
                multiline
                value={lesson.content}
                onChangeText={(text) => updateLesson(index, 'content', text)}
            />
        </View>
    );
    
    // Tu pantalla de carga
    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#5E35B1" />
                <Text style={{ marginTop: 10 }}>Cargando datos del módulo...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Editar Módulo (ID: {courseId})</Text>
            
            {/* CORRECCIÓN: Se asegura que el mensaje siempre se renderice dentro de un <Text> */}
            {message ? <Text style={message.includes('Error') ? styles.errorText : styles.successText}>{message}</Text> : null}

            <Text style={styles.formSectionHeader}>Información General del Módulo</Text>

            {/* AÑADIDO: El selector para la categoría */}
            <Text style={styles.inputLabel}>Categoría del Módulo:</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                    <Picker.Item label="Gramática" value="Gramática" />
                    <Picker.Item label="Palabras clave" value="Palabras clave" />
                    <Picker.Item label="Cursos avanzados" value="Cursos avanzados" />
                </Picker>
            </View>

            <Text style={styles.inputLabel}>Nombre del Módulo:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
            
            <Text style={styles.inputLabel}>Idioma Objetivo:</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={targetLanguage} onValueChange={(itemValue) => setTargetLanguage(itemValue)}>
                    <Picker.Item label="Inglés" value="Ingles" />
                    <Picker.Item label="Español" value="Español" />
                </Picker>
            </View>

            <Text style={styles.inputLabel}>Objetivos del Módulo:</Text>
            <TextInput style={styles.inputArea} value={objectives} multiline />

            <Text style={styles.formSectionHeader}>Lecciones ({lessons.length} en total)</Text>
            {lessons.map(renderLessonInput)}

            <TouchableOpacity style={styles.addButton} onPress={addLesson} disabled={isEditing}>
                <Icon name="add-circle" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Añadir Nueva Lección</Text>
            </TouchableOpacity>

            {/* Botón de guardar mejorado */}
            <TouchableOpacity style={styles.saveButton} onPress={updateCourse} disabled={isEditing}>
                {isEditing ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>GUARDAR CAMBIOS</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
};

// Estilos unificados y corregidos
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#5E35B1', marginBottom: 20, textAlign: 'center' },
    formSectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 20 },
    inputLabel: { fontSize: 14, color: '#555', marginTop: 10, marginBottom: 5 },
    input: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#fff' },
    inputArea: { minHeight: 80, textAlignVertical: 'top', borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, backgroundColor: '#fff' },
    pickerContainer: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, backgroundColor: '#fff', marginBottom: 10 },
    picker: { height: 50, width: '100%' },
    lessonCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e0e0e0' },
    lessonHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#5E35B1' },
    addButton: { flexDirection: 'row', backgroundColor: '#3CB371', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    addButtonText: { color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 16 },
    saveButton: { backgroundColor: '#5E35B1', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 50 },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    successText: { color: 'green', textAlign: 'center', fontWeight: 'bold', marginBottom: 15, fontSize: 16 },
    errorText: { color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: 15, fontSize: 16 },
});

export default CourseEditScreen;

