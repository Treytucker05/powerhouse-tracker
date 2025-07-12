import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const BuilderScreen = () => {
    const [trainingModel, setTrainingModel] = useState('Linear');
    const [mesocycleDuration, setMesocycleDuration] = useState('');

    const handleGenerateProgram = () => {
        console.log('Program Builder Data:', {
            selectedModel: trainingModel,
            duration: mesocycleDuration,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Program Builder</Text>
                <Text style={styles.subtitle}>Select your training model</Text>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Training Model</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={trainingModel}
                                style={styles.picker}
                                onValueChange={(value) => setTrainingModel(value)}
                            >
                                <Picker.Item label="Linear" value="Linear" />
                                <Picker.Item label="Undulating" value="Undulating" />
                                <Picker.Item label="Block" value="Block" />
                                <Picker.Item label="Conjugate" value="Conjugate" />
                                <Picker.Item label="Hybrid" value="Hybrid" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mesocycle Duration</Text>
                        <TextInput
                            style={styles.textInput}
                            value={mesocycleDuration}
                            onChangeText={setMesocycleDuration}
                            placeholder="e.g., 4 weeks"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Generate Program"
                            onPress={handleGenerateProgram}
                            color="#007AFF"
                        />
                    </View>
                </View>
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
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: '#333',
    },
    textInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        marginTop: 30,
        marginHorizontal: 20,
    },
});

export default BuilderScreen;
