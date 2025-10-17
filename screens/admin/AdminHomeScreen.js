import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 


const ActionCard = ({ iconName, title, description, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <Icon name={iconName} size={30} color="#5E35B1" style={styles.cardIcon} />
        <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color="#ccc" />
    </TouchableOpacity>
);

const AdminHomeScreen = ({ navigation, route }) => {
    const userName = route.params?.userName || 'Administrador';

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    // Funciones de navegación a las pestañas
    const navigateToStudents = () => {
        navigation.navigate('StudentList');
    };
    
    const navigateToCreateCourse = () => {
        navigation.navigate('ModuleCreation');
    };

    const navigateToManageCourses = () => {
        navigation.navigate('Modules');
    };

    return (
        <View style={styles.container}>
            <View>
   
                <Text style={styles.greeting}>¡Hola, {userName}!</Text>
                <Text style={styles.subtitle}>Panel de Control y Gestión de Contenido </Text>

                <Text style={styles.sectionHeader}>Acciones Rápidas</Text>

                {/* Lista de Acciones Agraciada */}
                <ActionCard 
                    iconName="people-outline" 
                    title="Ver Lista de Alumnos"
                    description="Revisa el progreso y datos de todos los usuarios inscritos."
                    onPress={navigateToStudents}
                />
                <ActionCard 
                    iconName="create-outline" 
                    title="Crear Nuevo Curso"
                    description="Diseña e ingresa un módulo con lecciones y contenido."
                    onPress={navigateToCreateCourse}
                />
                <ActionCard 
                    iconName="trash-outline" 
                    title="Eliminar y Editar Cursos"
                    description="Actualiza objetivos o borra módulos del sistema."
                    onPress={navigateToManageCourses}
                />
            </View>

            {/* Botón de Cerrar Sesión */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#f5f5f5',
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    greeting: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E88E5',
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
        marginBottom: 30,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5E35B1',
        marginTop: 10,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    // --- Estilos de la Tarjeta de Acción ---
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    cardIcon: {
        marginRight: 15,
    },
    cardTextContent: {
        flex: 1,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cardDescription: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    // --- Estilos de Botón de Logout ---
    logoutButton: {
        backgroundColor: '#B71C1C',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AdminHomeScreen;
