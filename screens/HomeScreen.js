import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HomeScreen = ({ route }) => {
   
    const { userRole, userName } = route.params || { userRole: 'Alumno', userName: 'Usuario' }; 
    const isProfessor = userRole === 'Profesor';

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.greeting}>
                Hola, {userName} 👋
            </Text>
            
            <Text style={styles.roleText}>
                Tu Rol es: {userRole}
            </Text>

            {isProfessor ? (
                // ------------------------------------------
                // VISTA DEL PROFESOR 
                // ------------------------------------------
                <View style={styles.contentBox}>
                    <Text style={styles.header}>Panel de Administración de Contenido 🧑‍🏫</Text>
                    <Text style={styles.infoText}>
                        Aquí irían las opciones para:
                    </Text>
                    <Text style={styles.listItem}>- Crear/Editar Lecciones y Cuestionarios.</Text>
                    <Text style={styles.listItem}>- Revisar el progreso de los alumnos.</Text>
                    <Text style={styles.listItem}>- Administrar usuarios y roles.</Text>
                </View>
            ) : (
                // ------------------------------------------
                // VISTA DEL ALUMNO 
                // ------------------------------------------
                <View style={styles.contentBox}>
                    <Text style={styles.header}>Mis Cursos y Lecciones 📚</Text>
                    <Text style={styles.infoText}>
                        Aquí iría la lista de lecciones obtenidas de `/api/lessons` 
                        (Gramática, Palabras clave, Cursos avanzados) según el diseño preliminar[cite: 541, 550, 552].
                    </Text>
                    {/* Más tarde integrarás fetchLessons() aquí */}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    greeting: { fontSize: 28, fontWeight: 'bold', color: '#1E90FF', marginBottom: 5 },
    roleText: { fontSize: 18, color: '#666', marginBottom: 30 },
    contentBox: { 
        backgroundColor: '#f0f8ff', 
        padding: 15, 
        borderRadius: 10, 
        borderLeftWidth: 5, 
        borderColor: '#1E90FF' 
    },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#1E90FF' },
    infoText: { fontSize: 16, marginBottom: 10 },
    listItem: { fontSize: 16, marginLeft: 10, marginTop: 5, color: '#333' }
});

export default HomeScreen;