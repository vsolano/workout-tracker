import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const ExportData = ({ exercises }) => {
    const exportToExcel = () => {
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
    };

    return (
        <button onClick={exportToExcel}>Export Data to Excel</button>
    );
};

export default ExportData;
