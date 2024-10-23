import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { getTasks } from '../Services/Service'; 

Chart.register(...registerables);

const colors = {
    PURPLE: '#afd1c6',
    PINK: '#15505d',
    GREEN: '#acfb03',
    ORANGE: '#3c895f',
    BLUE: '#7bd179'
};

type Props = {
    idUser : string
}

async function callTasks(idUser : string) {
    const res = await getTasks(idUser);
    return res; 
    
}

const TaskDifficultyChart: React.FC<Props> = ({idUser}) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    const handleCallTasks = async () => {
        const data = await callTasks(idUser);
        return data; 
    };

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        loadDifficultyDiagram();
    }, []);
    
    async function loadDifficultyDiagram() {
        const dataTask = await handleCallTasks();

        if (!dataTask) return; 

        if (canvasRef.current) {

            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;


            let dataValues: { [key: string]: number } = { "High": 0, "Middle": 0, "Low": 0 };

            // Recorrer los datos y contar las dificultades
            for (let i = 0; i < dataTask.length; i++) {
                const difficulty = dataTask[i].difficulty;
                if (difficulty in dataValues) {
                    dataValues[difficulty] += 1;
                } else {
                    console.warn(`Unexpected difficulty level: ${difficulty}`);
                }
            }

            // Crear el gráfico de barras
            const difficulties = ['High', 'Middle', 'Low'];
            chartRef.current = new Chart(ctx, {
                type: 'bar', // Puedes cambiar a 'line' o 'pie' según tus necesidades
                data: {
                    labels: difficulties,
                    datasets: [{
                        label: 'Number Of Tasks By Difficulty', // Etiqueta de la serie
                        data: [dataValues['High'], dataValues['Middle'], dataValues['Low']],
                        backgroundColor: [colors['PINK'], colors['BLUE'], colors['PURPLE']],
                        borderWidth: 2,
                        borderColor: '#000', // Color del borde
                        hoverBackgroundColor: [colors['PINK'], colors['BLUE'], colors['PURPLE']], // Color al pasar el mouse
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Task Distribution by Difficulty' // Título del gráfico
                        },
                        legend: {
                            display: true,
                            position: 'top', // Posición de la leyenda
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem: any) {
                                    return tooltipItem.dataset.label + ': ' + tooltipItem.raw; // Tooltip con la etiqueta y valor
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Difficulty' // Etiqueta del eje X
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number Of Tasks' // Etiqueta del eje Y
                            },
                            beginAtZero: true // Comenzar el eje Y en 0
                        }
                    }
                }
            });
        }
    };


    return (
        <canvas id="myCanvasTask" ref={canvasRef}></canvas>
    );
};

export default TaskDifficultyChart;
