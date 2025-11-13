import {useEffect, useRef} from "react"
import { Chart, registerables, Chart as ChartJS } from 'chart.js'
import type { ChartOptions } from 'chart.js'
import type { PredictionData } from '../../../pages/VehicleResults'

// Register the needed components for Chart.js
Chart.register(...registerables);

// Define the props for the component, which is the prediction data.
interface ValueTimelineProps {
    prediction: PredictionData;
}

export default function ValueTimeline({ prediction }: ValueTimelineProps) {
    // Refs to hold the chart instance and the canvas element
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<ChartJS | null>(null);

    // Effect to create/update the chart when prediction data changes
    useEffect(() => {
        // Needed check to ensure prediction and future_values exist
        if(!prediction?.prediction_results?.future_values) return;

        // Prepare the data for the chart
        const labels: string[] = ['Now', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
        const future_value: number[] = [
            prediction.prediction_results.current_value,
            // Extract the value from each future value entry
            ...prediction.prediction_results.future_values.map((fv: { value: number }) => fv.value)
        ];

        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            // Configure the chart data and options
            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Current Value',
                        data: future_value,
                        borderColor: 'rgb(75, 85, 99)',
                        backgroundColor: 'rgba(70, 70, 70, 0.06)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                    }
                ]
            };

            const chartOptions: ChartOptions<'line'> = {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        },
                        grid: {
                            color: 'rgba(200, 200, 200, 0.2)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '$' + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
                                }
                                return label;
                            }
                        }
                    }
                }
            };
            // Create the new chart instance
            chartInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: chartOptions
            });

        }
        // When the component unmounts, this will ensure the chart instance is destroyed.
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        }
    }, [prediction]);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-normal text-gray-900 mb-2">Value Timeline</h2>
                <p className="text-sm text-gray-600">Vehicle depreciation over time</p>
            </div>
            <div className="h-80 bg-gray-100 rounded-lg p-4">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    )
}