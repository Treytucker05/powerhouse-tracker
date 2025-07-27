import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Target, Dumbbell, Heart, Clock } from 'lucide-react';

const ExerciseLibrary = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
    const [selectedEquipment, setSelectedEquipment] = useState('all');

    const exerciseDatabase = [
        // Chest
        { id: 1, name: 'Barbell Bench Press', category: 'strength', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', difficulty: 'intermediate', type: 'compound' },
        { id: 2, name: 'Dumbbell Bench Press', category: 'strength', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'dumbbells', difficulty: 'beginner', type: 'compound' },
        { id: 3, name: 'Incline Barbell Press', category: 'strength', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'barbell', difficulty: 'intermediate', type: 'compound' },
        { id: 4, name: 'Dumbbell Flyes', category: 'strength', primaryMuscle: 'chest', secondaryMuscles: [], equipment: 'dumbbells', difficulty: 'beginner', type: 'isolation' },
        { id: 5, name: 'Push-ups', category: 'strength', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: 'bodyweight', difficulty: 'beginner', type: 'compound' },

        // Back
        { id: 6, name: 'Deadlift', category: 'strength', primaryMuscle: 'back', secondaryMuscles: ['glutes', 'hamstrings', 'traps'], equipment: 'barbell', difficulty: 'advanced', type: 'compound' },
        { id: 7, name: 'Pull-ups', category: 'strength', primaryMuscle: 'back', secondaryMuscles: ['biceps'], equipment: 'bodyweight', difficulty: 'intermediate', type: 'compound' },
        { id: 8, name: 'Bent-over Barbell Row', category: 'strength', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'rear_delts'], equipment: 'barbell', difficulty: 'intermediate', type: 'compound' },
        { id: 9, name: 'Lat Pulldown', category: 'strength', primaryMuscle: 'back', secondaryMuscles: ['biceps'], equipment: 'cable', difficulty: 'beginner', type: 'compound' },
        { id: 10, name: 'T-Bar Row', category: 'strength', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'rear_delts'], equipment: 'barbell', difficulty: 'intermediate', type: 'compound' },

        // Legs
        { id: 11, name: 'Barbell Back Squat', category: 'strength', primaryMuscle: 'quadriceps', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'barbell', difficulty: 'intermediate', type: 'compound' },
        { id: 12, name: 'Romanian Deadlift', category: 'strength', primaryMuscle: 'hamstrings', secondaryMuscles: ['glutes', 'back'], equipment: 'barbell', difficulty: 'intermediate', type: 'compound' },
        { id: 13, name: 'Walking Lunges', category: 'strength', primaryMuscle: 'quadriceps', secondaryMuscles: ['glutes', 'hamstrings'], equipment: 'dumbbells', difficulty: 'beginner', type: 'compound' },
        { id: 14, name: 'Leg Press', category: 'strength', primaryMuscle: 'quadriceps', secondaryMuscles: ['glutes'], equipment: 'machine', difficulty: 'beginner', type: 'compound' },
        { id: 15, name: 'Calf Raises', category: 'strength', primaryMuscle: 'calves', secondaryMuscles: [], equipment: 'bodyweight', difficulty: 'beginner', type: 'isolation' },

        // Shoulders
        { id: 16, name: 'Overhead Press', category: 'strength', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps', 'core'], equipment: 'barbell', difficulty: 'intermediate', type: 'compound' },
        { id: 17, name: 'Dumbbell Shoulder Press', category: 'strength', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], equipment: 'dumbbells', difficulty: 'beginner', type: 'compound' },
        { id: 18, name: 'Lateral Raises', category: 'strength', primaryMuscle: 'shoulders', secondaryMuscles: [], equipment: 'dumbbells', difficulty: 'beginner', type: 'isolation' },
        { id: 19, name: 'Face Pulls', category: 'strength', primaryMuscle: 'rear_delts', secondaryMuscles: ['rhomboids'], equipment: 'cable', difficulty: 'beginner', type: 'isolation' },

        // Arms
        { id: 20, name: 'Barbell Bicep Curls', category: 'strength', primaryMuscle: 'biceps', secondaryMuscles: [], equipment: 'barbell', difficulty: 'beginner', type: 'isolation' },
        { id: 21, name: 'Tricep Dips', category: 'strength', primaryMuscle: 'triceps', secondaryMuscles: ['chest'], equipment: 'bodyweight', difficulty: 'intermediate', type: 'compound' },
        { id: 22, name: 'Close-grip Bench Press', category: 'strength', primaryMuscle: 'triceps', secondaryMuscles: ['chest'], equipment: 'barbell', difficulty: 'intermediate', type: 'compound' },

        // Cardio
        { id: 23, name: 'Treadmill Running', category: 'cardio', primaryMuscle: 'cardiovascular', secondaryMuscles: ['legs'], equipment: 'treadmill', difficulty: 'beginner', type: 'cardio' },
        { id: 24, name: 'Cycling', category: 'cardio', primaryMuscle: 'cardiovascular', secondaryMuscles: ['quadriceps'], equipment: 'bike', difficulty: 'beginner', type: 'cardio' },
        { id: 25, name: 'Rowing Machine', category: 'cardio', primaryMuscle: 'cardiovascular', secondaryMuscles: ['back', 'legs'], equipment: 'machine', difficulty: 'beginner', type: 'cardio' },
        { id: 26, name: 'Burpees', category: 'cardio', primaryMuscle: 'cardiovascular', secondaryMuscles: ['full_body'], equipment: 'bodyweight', difficulty: 'intermediate', type: 'cardio' },

        // Core
        { id: 27, name: 'Plank', category: 'core', primaryMuscle: 'core', secondaryMuscles: ['shoulders'], equipment: 'bodyweight', difficulty: 'beginner', type: 'isometric' },
        { id: 28, name: 'Russian Twists', category: 'core', primaryMuscle: 'core', secondaryMuscles: [], equipment: 'bodyweight', difficulty: 'beginner', type: 'dynamic' },
        { id: 29, name: 'Dead Bug', category: 'core', primaryMuscle: 'core', secondaryMuscles: [], equipment: 'bodyweight', difficulty: 'beginner', type: 'stability' },
        { id: 30, name: 'Hanging Leg Raises', category: 'core', primaryMuscle: 'core', secondaryMuscles: [], equipment: 'pull_up_bar', difficulty: 'advanced', type: 'dynamic' }
    ];

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'strength', label: 'Strength Training' },
        { value: 'cardio', label: 'Cardiovascular' },
        { value: 'core', label: 'Core Training' },
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'plyometric', label: 'Plyometric' }
    ];

    const muscleGroups = [
        { value: 'all', label: 'All Muscle Groups' },
        { value: 'chest', label: 'Chest' },
        { value: 'back', label: 'Back' },
        { value: 'shoulders', label: 'Shoulders' },
        { value: 'biceps', label: 'Biceps' },
        { value: 'triceps', label: 'Triceps' },
        { value: 'quadriceps', label: 'Quadriceps' },
        { value: 'hamstrings', label: 'Hamstrings' },
        { value: 'glutes', label: 'Glutes' },
        { value: 'calves', label: 'Calves' },
        { value: 'core', label: 'Core' },
        { value: 'cardiovascular', label: 'Cardiovascular' }
    ];

    const equipment = [
        { value: 'all', label: 'All Equipment' },
        { value: 'barbell', label: 'Barbell' },
        { value: 'dumbbells', label: 'Dumbbells' },
        { value: 'cable', label: 'Cable Machine' },
        { value: 'machine', label: 'Machine' },
        { value: 'bodyweight', label: 'Bodyweight' },
        { value: 'kettlebell', label: 'Kettlebell' },
        { value: 'bands', label: 'Resistance Bands' }
    ];

    const filteredExercises = useMemo(() => {
        return exerciseDatabase.filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
            const matchesMuscleGroup = selectedMuscleGroup === 'all' ||
                exercise.primaryMuscle === selectedMuscleGroup ||
                exercise.secondaryMuscles.includes(selectedMuscleGroup);
            const matchesEquipment = selectedEquipment === 'all' || exercise.equipment === selectedEquipment;

            return matchesSearch && matchesCategory && matchesMuscleGroup && matchesEquipment;
        });
    }, [searchTerm, selectedCategory, selectedMuscleGroup, selectedEquipment]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-400 bg-green-900/20';
            case 'intermediate': return 'text-yellow-400 bg-yellow-900/20';
            case 'advanced': return 'text-red-400 bg-red-900/20';
            default: return 'text-gray-400 bg-gray-900/20';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'compound': return <Dumbbell className="h-4 w-4" />;
            case 'isolation': return <Target className="h-4 w-4" />;
            case 'cardio': return <Heart className="h-4 w-4" />;
            case 'isometric':
            case 'dynamic':
            case 'stability': return <Clock className="h-4 w-4" />;
            default: return <Dumbbell className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Exercise Library
                </h3>
                <p className="text-purple-300 text-sm">
                    Browse and select exercises for your training program
                </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                        {categories.map(category => (
                            <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                    </select>

                    {/* Muscle Group Filter */}
                    <select
                        value={selectedMuscleGroup}
                        onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                        {muscleGroups.map(group => (
                            <option key={group.value} value={group.value}>{group.label}</option>
                        ))}
                    </select>

                    {/* Equipment Filter */}
                    <select
                        value={selectedEquipment}
                        onChange={(e) => setSelectedEquipment(e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                        {equipment.map(eq => (
                            <option key={eq.value} value={eq.value}>{eq.label}</option>
                        ))}
                    </select>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400">
                        Showing {filteredExercises.length} of {exerciseDatabase.length} exercises
                    </p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
                        <Plus className="h-4 w-4" />
                        Add Custom Exercise
                    </button>
                </div>

                {/* Exercise Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredExercises.map(exercise => (
                        <div key={exercise.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <h4 className="text-white font-medium">{exercise.name}</h4>
                                <div className="flex items-center gap-1 text-gray-400">
                                    {getTypeIcon(exercise.type)}
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Primary:</span>
                                    <span className="text-white text-sm capitalize">{exercise.primaryMuscle.replace('_', ' ')}</span>
                                </div>

                                {exercise.secondaryMuscles.length > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">Secondary:</span>
                                        <span className="text-gray-300 text-sm capitalize">
                                            {exercise.secondaryMuscles.map(muscle => muscle.replace('_', ' ')).join(', ')}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Equipment:</span>
                                    <span className="text-white text-sm capitalize">{exercise.equipment.replace('_', ' ')}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getDifficultyColor(exercise.difficulty)}`}>
                                    {exercise.difficulty}
                                </span>
                                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm">
                                    Add to Program
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredExercises.length === 0 && (
                    <div className="text-center py-12">
                        <Filter className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No exercises found</p>
                        <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>

            {/* Exercise Categories Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(1).map(category => {
                    const categoryCount = exerciseDatabase.filter(ex => ex.category === category.value).length;
                    return (
                        <div key={category.value} className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-white">{categoryCount}</div>
                            <div className="text-gray-400 text-sm">{category.label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ExerciseLibrary;
