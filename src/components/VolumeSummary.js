<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 4353750def69b51e53ff5b530195d545a5366b45

const VolumeSummary = ({ exercises }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [volumeByMuscleGroup, setVolumeByMuscleGroup] = useState({});
    const [totalVolume, setTotalVolume] = useState(0);

<<<<<<< HEAD
    const handleDateChange = useCallback((setter) => (e) => {
        setter(e.target.value);
    }, []);

    useEffect(() => {
        const filteredExercises = exercises.filter(ex => {
            const exerciseDate = new Date(ex.date).setHours(0, 0, 0, 0);
            const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
            const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

=======
    useEffect(() => {
        const filteredExercises = exercises.filter(ex => {
            const exerciseDate = new Date(ex.date).setHours(0, 0, 0, 0); // normalize date to midnight
            const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
            const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null; // normalize end date to the end of the day
            
>>>>>>> 4353750def69b51e53ff5b530195d545a5366b45
            return (!start || exerciseDate >= start) && (!end || exerciseDate <= end);
        });

        const volumeByGroup = filteredExercises.reduce((acc, ex) => {
            const volume = ex.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
<<<<<<< HEAD
            acc[ex.muscleGroup] = (acc[ex.muscleGroup] || 0) + volume;
=======
            if (!acc[ex.muscleGroup]) {
                acc[ex.muscleGroup] = 0;
            }
            acc[ex.muscleGroup] += volume;
>>>>>>> 4353750def69b51e53ff5b530195d545a5366b45
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
<<<<<<< HEAD
                    onChange={handleDateChange(setStartDate)}
=======
                    onChange={(e) => setStartDate(e.target.value)}
>>>>>>> 4353750def69b51e53ff5b530195d545a5366b45
                />
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
<<<<<<< HEAD
                    onChange={handleDateChange(setEndDate)}
=======
                    onChange={(e) => setEndDate(e.target.value)}
>>>>>>> 4353750def69b51e53ff5b530195d545a5366b45
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
