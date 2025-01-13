import React, { useState } from 'react';

const muscleGroups = {
    "Chest": ["Bench Press", "Chest Fly"],
    "Back": ["Pull Up", "Row"],
    "Shoulders": ["Overhead Press", "Lateral Raise"],
    "Biceps": ["Curl"],
    "Triceps": ["Tricep Extension"],
    "Quads": ["Squat"],
    "Hamstrings": ["Deadlift"],
    "Abs": ["Crunch"]
};

const ExerciseForm = ({ addExercise, exercises }) => {
    const [name, setName] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('Chest');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [superset, setSuperset] = useState(false);
    const [linkedExercise, setLinkedExercise] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addExercise({ id: Date.now(), name, muscleGroup, sets: [], date, linkedExercise });
        setName('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Exercise Name"
                required
            />
            <select value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)}>
                {Object.keys(muscleGroups).map(group => (
                    <option key={group} value={group}>{group}</option>
                ))}
            </select>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <div>
                <input
                    type="checkbox"
                    checked={superset}
                    onChange={(e) => setSuperset(e.target.checked)}
                />
                <label>Part of a Superset</label>
                {superset && (
                    <select value={linkedExercise} onChange={(e) => setLinkedExercise(e.target.value)}>
                        <option value="">Select Linked Exercise</option>
                        {exercises.map(ex => (
                            <option key={ex.id} value={ex.name}>{ex.name}</option>
                        ))}
                    </select>
                )}
            </div>
            <button type="submit">Add Exercise</button>
        </form>
    );
};

export default ExerciseForm;
