import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

// Placeholder screen components
const DashboardScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.screenText}>Dashboard Screen</Text>
    </View>
);

const AssessmentScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.screenText}>Assessment Screen</Text>
    </View>
);

const BuilderScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.screenText}>Builder Screen</Text>
    </View>
);

const WorkoutScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.screenText}>Workout Screen</Text>
    </View>
);

const TrackingScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.screenText}>Tracking Screen</Text>
    </View>
);

const ProfileScreen = () => (
    <View style={styles.screenContainer}>
        <Text style={styles.screenText}>Profile Screen</Text>
    </View>
);

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        switch (route.name) {
                            case 'Home':
                                iconName = 'home';
                                break;
                            case 'Assess':
                                iconName = 'checklist';
                                break;
                            case 'Build':
                                iconName = 'build';
                                break;
                            case 'Train':
                                iconName = 'fitness-center';
                                break;
                            case 'Track':
                                iconName = 'bar-chart';
                                break;
                            case 'Profile':
                                iconName = 'person';
                                break;
                            default:
                                iconName = 'home';
                        }

                        return <MaterialIcons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#007AFF',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        paddingBottom: 5,
                        height: 60,
                        backgroundColor: '#fff',
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '500',
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Home" component={DashboardScreen} />
                <Tab.Screen name="Assess" component={AssessmentScreen} />
                <Tab.Screen name="Build" component={BuilderScreen} />
                <Tab.Screen name="Train" component={WorkoutScreen} />
                <Tab.Screen name="Track" component={TrackingScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    screenText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default App;
