import React, { useState, useCallback } from 'react';
import RestTimer from './RestTimer';

const ExerciseList = ({ exercises, removeExercise, addSet, updateSet, removeSet }) => {
    const [activeTimers, setActiveTimers] = useState({});

    const handleStartTimer = useCallback((exerciseId) => {
        try {
            setActiveTimers(prev => ({ ...prev, [exerciseId]: Date.now() }));
        } catch (error) {
            console.error("Error starting timer: ", error);
        }
    }, []);

    const dateColorMap = {};
    const colors = ['day-shade-1', 'day-shade-2', 'day-shade-3', 'day-shade-4'];
    let colorIndex = 0;

    const getDayColorClass = useCallback((date) => {
        if (!dateColorMap[date]) {
            dateColorMap[date] = colors[colorIndex % colors.length];
            colorIndex++;
        }
        return dateColorMap[date];
    }, [dateColorMap, colors, colorIndex]);

    return (
        <div>
            {exercises.map((ex) => (
                <div key={ex.id} className={`exercise-card ${getDayColorClass(new Date(ex.date).toLocaleDateString())}`}>
                    <h3>{ex.name} - {ex.muscleGroup}</h3>
                    <p>Date: {new Date(ex.date).toLocaleDateString()}</p>
                    {ex.linkedExercise && <p>Superset with: {ex.linkedExercise}</p>}
                    <button onClick={() => removeExercise(ex.id)}>Remove Exercise</button>
                    <button onClick={() => addSet(ex.id)}>Add Set</button>
                    <button onClick={() => handleStartTimer(ex.id)}>Start Timer</button>
                    {activeTimers[ex.id] && <RestTimer startTime={activeTimers[ex.id]} />}
                    <table>
                        <thead>
                            <tr>
                                <th>Sets</th>
                                <th>Reps</th>
                                <th>Weight</th>
                                <th>Volume</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ex.sets.map((set, index) => (
                                <tr key={set.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={set.reps}
                                            onChange={(e) => updateSet(ex.id, set.id, 'reps', e.target.value)}
                                            placeholder="Reps"
                                            style={{ width: '60px' }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={set.weight}
                                            onChange={(e) => updateSet(ex.id, set.id, 'weight', e.target.value)}
                                            placeholder="Weight"
                                            style={{ width: '60px' }}
                                        />
                                    </td>
                                    <td style={{ minWidth: '120px' }}>{set.weight * set.reps}</td>
                                    <td>
                                        <button onClick={() => removeSet(ex.id, set.id)}>Remove Set</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default ExerciseList;
