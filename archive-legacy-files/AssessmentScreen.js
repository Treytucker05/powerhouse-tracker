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

const AssessmentScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        primaryGoal: 'Strength',
        trainingAge: '',
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        console.log('Assessment Form Data:', formData);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>PowerHouse Assessment</Text>
                <Text style={styles.subtitle}>Tell us about yourself</Text>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.textInput}
                            value={formData.name}
                            onChangeText={(value) => handleInputChange('name', value)}
                            placeholder="Enter your name"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Primary Goal</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.primaryGoal}
                                style={styles.picker}
                                onValueChange={(value) => handleInputChange('primaryGoal', value)}
                            >
                                <Picker.Item label="Strength" value="Strength" />
                                <Picker.Item label="Hypertrophy" value="Hypertrophy" />
                                <Picker.Item label="Power/Sport" value="Power/Sport" />
                                <Picker.Item label="Hybrid" value="Hybrid" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Training Age (Years)</Text>
                        <TextInput
                            style={styles.textInput}
                            value={formData.trainingAge}
                            onChangeText={(value) => handleInputChange('trainingAge', value)}
                            placeholder="Enter years of training experience"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Submit Assessment"
                            onPress={handleSubmit}
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
    buttonContainer: {
        marginTop: 30,
        marginHorizontal: 20,
    },
});

export default AssessmentScreen;
