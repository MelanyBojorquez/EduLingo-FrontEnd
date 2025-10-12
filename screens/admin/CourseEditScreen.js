// screens/admin/CourseEditScreen.js
import React from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCourseEditViewModel } from '../../ViewModel/CourseEditViewModel'; 

const CourseEditScreen = ({ route, navigation }) => {
    // Obtener el ID del curso de los parámetros de navegación
    const { courseId } = route.params; 

    const {
        title, setTitle, targetLanguage, setTargetLanguage, objectives, setObjectives,
        lessons, addLesson, updateLesson,
        isLoading, isEditing, message, updateCourse
    } = useCourseEditViewModel(courseId, navigation); // Pasar ID y navegación

    // Componente para renderizar la lección (copiado de ModuleCreationScreen)
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
    
    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#5E35B1" />
                <Text style={{ marginTop: 10 }}>Cargando datos del curso...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Editar Curso ID: {courseId}</Text>
            
            {/* Mensaje de estado */}
            {message ? <Text style={message.startsWith('✅') ? styles.successText : styles.errorText}>{message}</Text> : null}

            {/* Formulario principal del Curso (similares a ModuleCreationScreen) */}
            <Text style={styles.formSectionHeader}>Información General del Curso</Text>
            <Text style={styles.inputLabel}>Nombre del Curso:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
            
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
                multiline
            />

            {/* Secciones de Lecciones */}
            <Text style={styles.formSectionHeader}>Lecciones ({lessons.length} en total)</Text>
            
            {lessons.map(renderLessonInput)}

            <TouchableOpacity style={styles.addButton} onPress={addLesson} disabled={isEditing}>
                <Icon name="add-circle" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Añadir Nueva Lección</Text>
            </TouchableOpacity>

            {/* Botón de Guardar */}
            <View style={styles.saveButtonContainer}>
                <Button
                    title={isEditing ? "ACTUALIZANDO..." : "GUARDAR CAMBIOS"}
                    onPress={updateCourse}
                    disabled={isEditing}
                    color="#5E35B1"
                />
            </View>
            
            {isEditing && <ActivityIndicator size="small" color="#5E35B1" style={{ marginTop: 10 }} />}
        </ScrollView>
    );
};

// ... (Copiar estilos de ModuleCreationScreen.js si son compartidos o ajustarlos)
const styles = StyleSheet.create({ /* ... */ });

export default CourseEditScreen;