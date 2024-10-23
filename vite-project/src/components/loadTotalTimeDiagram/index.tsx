import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, Colors } from 'chart.js';
import { getTasks } from '../Services/Service'; 
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

const TotalTimeDiagram: React.FC<Props> = ({idUser}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    const handleCallTasks = () =>{
        return callTasks(idUser);
    }

    useEffect(() => {
        // Destruir el gráfico existente si ya existe
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        loadTotalTimeDiagram();
    }, []);

    async function loadTotalTimeDiagram() {
        const data = await handleCallTasks();
        
        if (!data) return;

        const dataValues: { [key: string]: number } = { "High": 0, "Middle": 0, "Low": 0 };

        // Recorrer los datos y contar los tiempos estimados de las tareas completadas
        for (let i = 0; i < data.length; i++) {
            if (data[i].isCompleted) {
                dataValues[data[i].difficulty] += data[i].estimatedTime;
            }
        }

        const difficulties = ['High', 'Middle', 'Low'];

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            // Configuración del gráfico
            const config: ChartConfiguration = {
                type: 'pie', // Tipo de gráfico: pastel
                data: {
                    labels: difficulties,
                    datasets: [{
                        label: 'Total Time Spent by Difficulty', // Etiqueta de la serie
                        data: [dataValues['High'], dataValues['Middle'], dataValues['Low']],
                        backgroundColor: [colors['PINK'], colors['BLUE'], colors['PURPLE']], // Colores del gráfico
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Total Time Spent by Difficulty' // Título del gráfico
                        },
                        legend: {
                            display: true,
                            position: 'top', // Posición de la leyenda
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem: any) {
                                    return tooltipItem.dataset.label + ': ' + tooltipItem.raw + ' hours';
                                }
                            }
                        }
                    }
                }
            };

            chartRef.current = new Chart(ctx, config);
        }
    }

    return (
        <canvas id="myFullTimeTask" ref={canvasRef}></canvas>
    );
};

export default TotalTimeDiagram;