import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useModuleCreationViewModel } from '../../ViewModel/ModuleCreationViewModel';

const ModuleCreationScreen = () => {
    const {
        category, setCategory,
        title, setTitle,
        targetLanguage, setTargetLanguage,
        objectives, setObjectives,
        lessons, addLesson, updateLesson,
        isLoading, message, createCourse
    } = useModuleCreationViewModel();

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Crear Nuevo Módulo</Text>
            
            {/* Se muestra el mensaje de estado (éxito o error) */}
            {message ? <Text style={message.includes('Error') ? styles.errorText : styles.successText}>{message}</Text> : null}

            <Text style={styles.formSectionHeader}>Información General del Módulo</Text>

            <Text style={styles.inputLabel}>Categoría del Módulo</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                    <Picker.Item label="Gramática" value="Gramática" />
                    <Picker.Item label="Palabras clave" value="Palabras clave" />
                    <Picker.Item label="Cursos avanzados" value="Cursos avanzados" />
                </Picker>
            </View>

            <Text style={styles.inputLabel}>Nombre del Módulo</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Verbos en Presente Simple" />
            
            <Text style={styles.inputLabel}>Idioma Objetivo</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={targetLanguage} onValueChange={(itemValue) => setTargetLanguage(itemValue)}>
                    <Picker.Item label="Inglés" value="Ingles" />
                    <Picker.Item label="Español" value="Español" />
                </Picker>
            </View>

            <Text style={styles.inputLabel}>Objetivos del Módulo</Text>
            <TextInput style={styles.inputArea} value={objectives} onChangeText={setObjectives} multiline placeholder="¿Qué aprenderá el alumno en este módulo?" />

            <Text style={styles.formSectionHeader}>Lecciones del Módulo</Text>
            {lessons.map((lesson, index) => (
                <View key={index} style={styles.lessonCard}>
                    <Text style={styles.lessonHeader}>{lesson.lessonTitle}</Text>
                    <TextInput style={styles.input} value={lesson.url} onChangeText={(text) => updateLesson(index, 'url', text)} placeholder="URL del Video (YouTube, etc.)" />
                </View>
            ))}
            
            <TouchableOpacity style={styles.addButton} onPress={addLesson}>
                <Icon name="add-circle-outline" size={20} color="#5E35B1" />
                <Text style={styles.addButtonText}>Añadir otra lección</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={createCourse} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>GUARDAR MÓDULO</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#5E35B1', marginBottom: 20, textAlign: 'center' },
    formSectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 20 },
    inputLabel: { fontSize: 14, color: '#555', marginTop: 10, marginBottom: 5 },
    input: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#fff' },
    inputArea: { minHeight: 80, textAlignVertical: 'top', borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, backgroundColor: '#fff' },
    pickerContainer: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, backgroundColor: '#fff', marginBottom: 10 },
    lessonCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e0e0e0' },
    lessonHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#5E35B1' },
    addButton: { flexDirection: 'row', backgroundColor: 'transparent', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#5E35B1' },
    addButtonText: { color: '#5E35B1', marginLeft: 10, fontWeight: 'bold', fontSize: 16 },
    saveButton: { backgroundColor: '#5E35B1', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 50 },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    successText: { color: 'green', textAlign: 'center', fontWeight: 'bold', marginBottom: 15, fontSize: 16 },
    errorText: { color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: 15, fontSize: 16 },
});

export default ModuleCreationScreen;