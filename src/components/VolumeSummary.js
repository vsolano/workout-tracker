import React, { useState, useEffect } from 'react';

const VolumeSummary = ({ exercises }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [volumeByMuscleGroup, setVolumeByMuscleGroup] = useState({});
    const [totalVolume, setTotalVolume] = useState(0);

    useEffect(() => {
        const filteredExercises = exercises.filter(ex => {
            const exerciseDate = new Date(ex.date).setHours(0, 0, 0, 0); // normalize date to midnight
            const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
            const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null; // normalize end date to the end of the day
            
            return (!start || exerciseDate >= start) && (!end || exerciseDate <= end);
        });

        const volumeByGroup = filteredExercises.reduce((acc, ex) => {
            const volume = ex.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
            if (!acc[ex.muscleGroup]) {
                acc[ex.muscleGroup] = 0;
            }
            acc[ex.muscleGroup] += volume;
            return acc;
        }, {});

        const totalVol = Object.values(volumeByGroup).reduce((acc, volume) => acc + volume, 0);

        setVolumeByMuscleGroup(volumeByGroup);
        setTotalVolume(totalVol);
    }, [exercises, startDate, endDate]);

    return (
        <div>
            <h2>Volume Summary</h2>
            <div>
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <button onClick={() => setShowTable(!showTable)}>
                {showTable ? 'Hide Volume Summary' : 'Show Volume Summary'}
            </button>
            {showTable && (
                <table>
                    <thead>
                        <tr>
                            <th>Muscle Group</th>
                            <th>Total Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(volumeByMuscleGroup).map(([muscleGroup, volume]) => (
                            <tr key={muscleGroup}>
                                <td>{muscleGroup}</td>
                                <td>{volume}</td>
                            </tr>
                        ))}
                        <tr>
                            <td><strong>Total Volume</strong></td>
                            <td><strong>{totalVolume}</strong></td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VolumeSummary;
