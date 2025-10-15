import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import YoutubeIframe from 'react-native-youtube-iframe';

const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const ModuleDetailScreen = ({ route, navigation }) => {
    const { module } = route.params;

    // --- INICIO DE DEPURACIÓN ---
    console.log("\n--- DEBUG START ---");
    console.log("1. Módulo completo recibido (RAW):", JSON.stringify(module, null, 2));

    // --- ¡CORRECCIÓN CLAVE! ---
    // Esta nueva lógica lee las lecciones de forma segura,
    // manejando si llega como string JSON o ya como array.
    let lessons = [];
    if (module.content_json) {
        if (typeof module.content_json === 'string') {
            try {
                const parsedLessons = JSON.parse(module.content_json);
                if (Array.isArray(parsedLessons)) {
                    lessons = parsedLessons;
                }
            } catch (e) {
                console.error("ERROR: 'content_json' es un string pero no es un JSON válido.", e);
                console.log("Contenido que falló el parseo:", module.content_json);
            }
        } else if (Array.isArray(module.content_json)) {
            // Si ya es un array (el caso que estamos viendo en los logs)
            lessons = module.content_json;
        } else {
            console.log("ADVERTENCIA: 'content_json' no es un string ni un array.");
        }
    }
    // --- FIN DE LA CORRECCIÓN ---

    console.log("2. Lecciones finales procesadas:", lessons);
    // --- FIN DE DEPURACIÓN ---

    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            Alert.alert("¡Lección completada!", "¿Quieres pasar a la siguiente?");
        }
    }, []);

    const goToNextLesson = () => {
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
        }
    };

    const goToPreviousLesson = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1);
        }
    };

    const currentLesson = lessons[currentLessonIndex];
    const videoId = getYoutubeId(currentLesson?.url);

    // --- MÁS DEPURACIÓN ---
    console.log("3. Lección actual a mostrar:", currentLesson);
    console.log("4. URL que se pasa al extractor:", currentLesson?.url);
    console.log("5. ID de video extraído:", videoId);
    console.log("--- DEBUG END ---\n");
    // --- FIN DE DEPURACIÓN ---

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>EduLingo</Text>
                    <Text style={styles.headerSubtitle}>"Pequeños pasos, grandes conversaciones"</Text>
                </View>

                <View style={styles.lessonCard}>
                    <Text style={styles.lessonNumber}>{currentLesson?.lessonTitle || `Lección #${currentLessonIndex + 1}`}</Text>
                    <Text style={styles.sectionTitle}>Objetivo de la lección:</Text>
                    <Text style={styles.contentText}>- {module.objectives}</Text>

                    {videoId ? (
                        <View style={styles.videoContainer}>
                            <YoutubeIframe height={200} play={false} videoId={videoId} onChangeState={onStateChange} />
                        </View>
                    ) : (
                        <View style={styles.videoPlaceholder}>
                            <Icon name="videocam-off-outline" size={50} color="#999" />
                            <Text style={styles.placeholderText}>Video no disponible para esta lección</Text>
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>Contenido de la lección:</Text>
                    <Text style={styles.contentText}>- {currentLesson?.content || 'No hay descripción adicional.'}</Text>
                </View>

                <View style={styles.navButtonsContainer}>
                    <TouchableOpacity 
                        style={[styles.navButton, currentLessonIndex === 0 && styles.disabledButton]} 
                        onPress={goToPreviousLesson}
                        disabled={currentLessonIndex === 0}>
                        <Icon name="arrow-back-outline" size={20} color={currentLessonIndex === 0 ? '#aaa' : '#5E35B1'} />
                        <Text style={[styles.navButtonText, currentLessonIndex === 0 && styles.disabledText]}>Lección Anterior</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.navButton, currentLessonIndex >= lessons.length - 1 && styles.disabledButton]} 
                        onPress={goToNextLesson}
                        disabled={currentLessonIndex >= lessons.length - 1}>
                        <Text style={[styles.navButtonText, currentLessonIndex >= lessons.length - 1 && styles.disabledText]}>Lección Siguiente</Text>
                        <Icon name="arrow-forward-outline" size={20} color={currentLessonIndex >= lessons.length - 1 ? '#aaa' : '#5E35B1'} />
                    </TouchableOpacity>
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
    lessonCard: { backgroundColor: '#F3E5F5', borderRadius: 20, margin: 20, padding: 20 },
    lessonNumber: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 15 },
    contentText: { fontSize: 14, color: '#333', marginTop: 5 },
    videoContainer: { marginTop: 15, borderRadius: 15, overflow: 'hidden' },
    videoPlaceholder: { height: 200, backgroundColor: '#e9e9e9', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
    placeholderText: { marginTop: 10, color: '#999' },
    navButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, marginBottom: 30 },
    navButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    navButtonText: { fontSize: 14, fontWeight: '600', color: '#5E35B1', marginHorizontal: 8 },
    disabledButton: { backgroundColor: '#f5f5f5', elevation: 0 },
    disabledText: { color: '#aaa' },
});

export default ModuleDetailScreen;
