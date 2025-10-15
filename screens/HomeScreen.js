import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    FlatList, 
    ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUser, fetchLessons } from '../services/AuthService';

// --- Componente Reutilizable para el Carrusel de Cursos ---
// MODIFICADO: Ahora recibe 'navigation' para poder navegar.
const CourseCarousel = ({ title, data, navigation }) => (
    <View style={styles.carouselContainer}>
        <View style={styles.carouselHeader}>
            <Text style={styles.carouselTitle}>{title}</Text>
            <TouchableOpacity>
                <Icon name="chevron-forward-outline" size={24} color="#5E35B1" />
            </TouchableOpacity>
        </View>
        <FlatList
            data={data}
            renderItem={({ item }) => (
                // MODIFICADO: Se añade el evento onPress a la tarjeta.
                <TouchableOpacity 
                    style={styles.courseCard}
                    // Al presionar, navega a 'ModuleDetail' y le pasa todo el objeto del módulo.
                    onPress={() => navigation.navigate('ModuleDetail', { module: item })}
                >
                    <Text style={styles.courseCardTitle}>{item.title}</Text>
                </TouchableOpacity>
            )}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
        />
    </View>
);

// --- Pantalla Principal del Alumno ---
// MODIFICADO: Ahora recibe 'navigation' para pasárselo a los carruseles.
const HomeScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('Usuario');
    const [courseSections, setCourseSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const user = await getUser();
                if (user && user.name) setUserName(user.name);

                const lessonsFromApi = await fetchLessons();
                const grouped = lessonsFromApi.reduce((acc, lesson) => {
                    const category = lesson.category || 'General';
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(lesson);
                    return acc;
                }, {});

                const sectionsArray = Object.keys(grouped).map(key => ({
                    title: key,
                    courses: grouped[key]
                }));

                setCourseSections(sectionsArray);
            } catch (e) {
                console.error("Error al cargar datos del HomeScreen:", e);
                setError("No se pudieron cargar los cursos. Intenta de nuevo más tarde.");
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.greeting}>Hola, {userName} 👋</Text>
                    <Text style={styles.headerSubtitle}>¿Qué quieres aprender hoy?</Text>
                </View>

                <View style={styles.searchContainer}>
                    <Icon name="search-outline" size={22} color="#888" style={styles.searchIcon} />
                    <TextInput placeholder="Buscar" style={styles.searchInput} />
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#5E35B1" style={{ marginTop: 50 }} />
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    courseSections.map((section, index) => (
                        // MODIFICADO: Se pasa la propiedad 'navigation' al carrusel.
                        <CourseCarousel 
                            key={index} 
                            title={section.title} 
                            data={section.courses}
                            navigation={navigation}
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    greeting: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    headerContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    headerSubtitle: { fontSize: 16, color: '#666', marginTop: 4 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 15, marginHorizontal: 20, marginTop: 10, paddingHorizontal: 15 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: 50, fontSize: 16 },
    carouselContainer: { marginTop: 30 },
    carouselHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15, backgroundColor: '#F3E5F5', paddingVertical: 12, borderRadius: 10, marginHorizontal: 20 },
    carouselTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    courseCard: { width: 140, height: 140, backgroundColor: '#e9e9e9', borderRadius: 15, marginRight: 15, justifyContent: 'center', alignItems: 'center', padding: 10 },
    courseCardTitle: { fontWeight: 'bold', textAlign: 'center' },
    errorText: { textAlign: 'center', marginTop: 50, color: 'red', fontSize: 16, paddingHorizontal: 20 },
});

export default HomeScreen;
