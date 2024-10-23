import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import {Task} from '../Services/TaskObject'
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

const PriorityDiagram: React.FC<Props> = ({idUser}) => {
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
        loadPriorityDiagram();
    }, []);

    async function loadPriorityDiagram() {
        const data = await handleCallTasks();
        if (!data) return; // Si no hay datos, salir de la función para evitar errores.

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            let dataValues: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            // Recorrer los datos y contar las prioridades
            for (let i = 0; i < data.length; i++) {
                const priority = data[i].priority;
                if (priority in dataValues) {
                    dataValues[priority] += 1;
                } else {
                    console.warn(`Unexpected priority level: ${priority}`);
                }
            }

            // Crear el gráfico de barras
            const priorities = [1, 2, 3, 4, 5];
            chartRef.current = new Chart(ctx, {
                type: 'bar', // Puedes cambiar a 'line' o 'pie' según tus necesidades
                data: {
                    labels: priorities,
                    datasets: [{
                        label: 'Number Of Tasks By Priority', // Etiqueta de la serie
                        data: [dataValues[1], dataValues[2], dataValues[3], dataValues[4], dataValues[5]],
                        backgroundColor: [colors['GREEN'], colors['PINK'], colors['BLUE'], colors['PURPLE'], colors['ORANGE']],
                        borderWidth: 2,
                        borderColor: '#000', // Color del borde
                        hoverBackgroundColor: [colors['GREEN'], colors['PINK'], colors['BLUE'], colors['PURPLE'], colors['ORANGE']], // Color al pasar el mouse
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Task Distribution by Priority' // Título del gráfico
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
                                text: 'Priority' // Etiqueta del eje X
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
    }
    return (
        <canvas id="myCanvasPriority" ref={canvasRef}></canvas>
    
    );
};

export default PriorityDiagram;