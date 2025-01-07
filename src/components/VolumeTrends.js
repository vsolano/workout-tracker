import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const VolumeTrends = ({ exercises }) => {
    const data = {
        labels: exercises.map(ex => new Date(ex.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Volume',
                data: exercises.map(ex => ex.sets.reduce((total, set) => total + (set.weight * set.reps), 0)),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div>
            <h2>Volume Trends Over Time</h2>
            <Line data={data} />
        </div>
    );
};

export default VolumeTrends;
