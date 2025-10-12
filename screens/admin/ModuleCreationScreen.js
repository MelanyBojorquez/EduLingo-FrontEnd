// screens/admin/ModuleCreationScreen.js
import React from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useModuleCreationViewModel } from '../../ViewModel/ModuleCreationViewModel';

const ModuleCreationScreen = () => {
    const {
        title, setTitle, targetLanguage, setTargetLanguage, objectives, setObjectives,
        lessons, addLesson, updateLesson,
        isLoading, message, createCourse
    } = useModuleCreationViewModel();

    // Renderiza el campo de cada lección
    const renderLessonInput = (lesson, index) => (
        <View key={index} style={styles.lessonCard}>
            <Text style={styles.lessonHeader}>{lesson.lessonTitle}</Text>
            
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

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Crear Nuevo Curso</Text>
            
            {/* Mensaje de estado */}
            {message ? <Text style={message.startsWith('✅') ? styles.successText : styles.errorText}>{message}</Text> : null}

            {/* Formulario principal del Curso */}
            <Text style={styles.formSectionHeader}>Información General del Curso</Text>
            <Text style={styles.inputLabel}>Nombre del Curso:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Presente Simple" />
            
            <Text style={styles.inputLabel}>Idioma Objetivo:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={targetLanguage}
                    onValueChange={(itemValue) => setTargetLanguage(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Inglés" value="Ingles" />
                    <Picker.Item label="Español" value="Español" />
                </Picker>
            </View>

            <Text style={styles.inputLabel}>Objetivos del Curso:</Text>
            <TextInput 
                style={styles.inputArea} 
                value={objectives} 
                onChangeText={setObjectives} 
                placeholder="Máximo 3 objetivos claros."
                multiline
            />

            {/* Secciones de Lecciones */}
            <Text style={styles.formSectionHeader}>Lecciones del Módulo ({lessons.length} en total)</Text>
            
            {lessons.map(renderLessonInput)}

            <TouchableOpacity style={styles.addButton} onPress={addLesson} disabled={isLoading}>
                <Icon name="add-circle" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Añadir Nueva Lección</Text>
            </TouchableOpacity>

            {/* Botón de Guardar */}
            <View style={styles.saveButtonContainer}>
                <Button
                    title={isLoading ? "GUARDANDO..." : "GUARDAR CURSO COMPLETO"}
                    onPress={createCourse}
                    disabled={isLoading}
                    color="#5E35B1"
                />
            </View>
            
            {isLoading && <ActivityIndicator size="small" color="#5E35B1" style={{ marginTop: 10 }} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#5E35B1', marginBottom: 20 },
    formSectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10 },
    inputLabel: { fontSize: 14, color: '#555', marginTop: 5 },
    input: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10, backgroundColor: '#fff' },
    inputArea: { minHeight: 80, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 15, backgroundColor: '#fff' },
    pickerContainer: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 15, backgroundColor: '#fff' },
    picker: { height: 45, width: '100%' },
    lessonCard: { backgroundColor: '#eef', padding: 15, borderRadius: 8, marginBottom: 15, borderLeftWidth: 4, borderColor: '#5E35B1' },
    lessonHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    addButton: { flexDirection: 'row', backgroundColor: '#3CB371', padding: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    addButtonText: { color: '#fff', marginLeft: 10, fontWeight: 'bold' },
    saveButtonContainer: { marginTop: 10, marginBottom: 40 },
    successText: { color: 'green', textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
    errorText: { color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
});

export default ModuleCreationScreen;