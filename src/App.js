import React, { useState, useCallback } from 'react';
import ExerciseList from './components/ExerciseList';
import VolumeSummary from './components/VolumeSummary';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const App = () => {
    const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
    const [isLoadingWorkout, setIsLoadingWorkout] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newMuscleGroup, setNewMuscleGroup] = useState('');
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useLocalStorage('exercises', []);
    const [savedWorkouts, setSavedWorkouts] = useLocalStorage('savedWorkouts', {});

    const startNewWorkout = useCallback(() => {
        setIsCreatingWorkout(true);
        setIsLoadingWorkout(false);
    }, []);

    const resetApp = useCallback(() => {
        setExercises([]);
        setSavedWorkouts({});
        setNewExerciseName('');
        setNewMuscleGroup('');
        setWorkoutName('');
        setIsCreatingWorkout(false);
        setIsLoadingWorkout(false);
    }, [setExercises, setSavedWorkouts]);

    const addExercise = useCallback(() => {
        const lastExercise = exercises.find(ex => ex.name === newExerciseName);
        const exercise = {
            id: Date.now(),
            name: newExerciseName,
            muscleGroup: newMuscleGroup,
            date: new Date().toISOString(),
            sets: lastExercise ? Array.from({ length: 3 }).map((_, index) => ({
                ...lastExercise.sets[lastExercise.sets.length - 1],
                id: Date.now() + index + Math.random()
            })) : Array.from({ length: 3 }).map((_, index) => ({
                id: Date.now() + index + Math.random(),
                weight: 0,
                reps: 0
            }))
        };
        setExercises(prevExercises => [...prevExercises, exercise]);
        setNewExerciseName('');
        setNewMuscleGroup('');
    }, [newExerciseName, newMuscleGroup, exercises, setExercises]);

    const removeExercise = useCallback((id) => {
        setExercises(exercises.filter(ex => ex.id !== id));
    }, [exercises, setExercises]);

    const addSet = useCallback((exerciseId) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                const lastSet = ex.sets[ex.sets.length - 1];
                return {
                    ...ex,
                    sets: [...ex.sets, { id: Date.now(), weight: lastSet ? lastSet.weight : 0, reps: lastSet ? lastSet.reps : 0 }]
                };
            }
            return ex;
        }));
    }, [exercises, setExercises]);

    const updateSet = useCallback((exerciseId, setId, field, value) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                const updatedSets = ex.sets.map(set => {
                    if (set.id === setId) {
                        const updatedSet = { ...set, [field]: Number(value) };
                        updatedSet.volume = updatedSet.weight * updatedSet.reps;
                        return updatedSet;
                    }
                    return set;
                });
                return { ...ex, sets: updatedSets };
            }
            return ex;
        }));
    }, [exercises, setExercises]);

    const removeSet = useCallback((exerciseId, setId) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                return {
                    ...ex,
                    sets: ex.sets.filter(set => set.id !== setId)
                };
            }
            return ex;
        }));
    }, [exercises, setExercises]);

    const saveWorkout = useCallback(() => {
        try {
            setSavedWorkouts(prev => ({ ...prev, [workoutName]: exercises }));
        } catch (error) {
            console.error("Error saving workout: ", error);
        }
    }, [workoutName, exercises, setSavedWorkouts]);

    const loadWorkout = useCallback(() => {
        setIsLoadingWorkout(true);
        setExercises([]); // Clear previous exercises
    }, [setExercises]);

    const handleWorkoutSelection = useCallback((name) => {
        const savedExercises = savedWorkouts[name].map(ex => {
            const lastSets = ex.sets.slice(-3);
            const newSets = lastSets.map((set, index) => ({
                ...set,
                id: Date.now() + index + Math.random()
            }));
            return {
                ...ex,
                date: new Date().toISOString(),
                sets: newSets
            };
        });
        setExercises(savedExercises);
        setIsLoadingWorkout(false);
    }, [savedWorkouts, setExercises]);

    const exportToExcel = useCallback(() => {
        const data = exercises.map(ex => ({
            Date: new Date(ex.date).toLocaleDateString(),
            'Muscle Group': ex.muscleGroup,
            'Exercise Name': ex.name,
            Sets: ex.sets.length,
            Reps: ex.sets.map(set => set.reps).join(', '),
            Weight: ex.sets.map(set => set.weight).join(', '),
            Volume: ex.sets.map(set => set.weight * set.reps).reduce((a, b) => a + b, 0)
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Exercises');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'workout_tracker.xlsx');
    }, [exercises]);

    const handleEndWorkout = useCallback(() => {
        exportToExcel();
        // Keep the exercises for volume summary
        setIsCreatingWorkout(false);
    }, [exportToExcel]);

    return (
        <div>
            <h1>Workout Tracker</h1>
            <div>
                <button onClick={startNewWorkout}>Create Workout from Scratch</button>
                <button onClick={loadWorkout}>Load Saved Workout</button>
            </div>
            {isCreatingWorkout && (
                <div>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <input
                        type="text"
                        value={newExerciseName}
                        onChange={(e) => setNewExerciseName(e.target.value)}
                        placeholder="Exercise Name"
                    />
                    <select
                        value={newMuscleGroup}
                        onChange={(e) => setNewMuscleGroup(e.target.value)}
                    >
                        <option value="">Select Muscle Group</option>
                        <option value="Chest">Chest</option>
                        <option value="Back">Back</option>
                        <option value="Biceps">Biceps</option>
                        <option value="Triceps">Triceps</option>
                        <option value="Quads">Quads</option>
                        <option value="Hamstrings">Hamstrings</option>
                        <option value="Shoulders">Shoulders</option>
                        <option value="Abdominals">Abdominals</option>
                    </select>
                    <button onClick={addExercise}>Add Exercise</button>
                    <input
                        type="text"
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                        placeholder="Workout Name"
                    />
                    <button onClick={saveWorkout}>Save Workout</button>
                </div>
            )}
            {isLoadingWorkout && (
                <div>
                    <h2>Select a Saved Workout</h2>
                    {Object.keys(savedWorkouts).map(name => (
                        <button key={name} onClick={() => handleWorkoutSelection(name)}>{name}</button>
                    ))}
                </div>
            )}
            <ExerciseList
                exercises={exercises}
                removeExercise={removeExercise}
                addSet={addSet}
                updateSet={updateSet}
                removeSet={removeSet}
            />
            <button onClick={handleEndWorkout}>End Workout</button>
            <VolumeSummary exercises={exercises} />
            <button
                onClick={resetApp}
                style={{
                    backgroundColor: 'red',
                    color: 'white',
                    fontSize: '18px',
                    padding: '10px 20px',
                    margin: '20px 0',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                ERASE - START OVER
            </button>
        </div>
    );
};

export default App;
