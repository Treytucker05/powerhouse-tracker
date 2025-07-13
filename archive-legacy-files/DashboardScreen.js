import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const DashboardScreen = () => {
    const handleStartAssessment = () => {
        console.log('Navigating to Assess');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>PowerHouse Dashboard</Text>

                <Text style={styles.welcomeMessage}>Welcome to your training hub!</Text>

                <View style={styles.readinessBox}>
                    <Text style={styles.readinessText}>Today's Readiness: 85%</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleStartAssessment}>
                    <Text style={styles.buttonText}>Start Assessment</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    welcomeMessage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    readinessBox: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 40,
        minWidth: 200,
        alignItems: 'center',
    },
    readinessText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        minWidth: 150,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});

export default DashboardScreen;
