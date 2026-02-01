import {useEffect, useRef} from "react"
import { Chart, registerables, Chart as ChartJS } from 'chart.js'
import type { ChartOptions } from 'chart.js'
import type { PredictionData } from '../../../pages/VehicleResults'
import { TrendingUp } from 'lucide-react';

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
            // Configure the chart data and options with dark theme colors
            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Projected Value',
                        data: future_value,
                        borderColor: 'rgb(251, 191, 36)', // amber-400
                        backgroundColor: 'rgba(251, 191, 36, 0.1)', // amber with transparency
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 8,
                        pointBackgroundColor: 'rgb(251, 191, 36)',
                        pointBorderColor: 'rgb(30, 41, 59)', // slate-800
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: 'rgb(251, 191, 36)',
                        pointHoverBorderColor: 'rgb(251, 191, 36)',
                        borderWidth: 3,
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
                                return '$' + value.toLocaleString();
                            },
                            color: 'rgb(148, 163, 184)', // slate-400
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(71, 85, 105, 0.3)', // slate-600 with transparency
                        },
                        border: {
                            display: false
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgb(148, 163, 184)', // slate-400
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            display: false
                        },
                        border: {
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
                            boxWidth: 8,
                            color: 'rgb(203, 213, 225)', // slate-300
                            font: {
                                size: 13,
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(30, 41, 59, 0.95)', // slate-800
                        titleColor: 'rgb(251, 191, 36)', // amber-400
                        bodyColor: 'rgb(226, 232, 240)', // slate-200
                        borderColor: 'rgba(251, 191, 36, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
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
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-3">
                        <TrendingUp className="w-4 h-4 text-slate-900" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Value Timeline</h2>
                </div>
                <p className="text-sm text-slate-400 ml-11">Vehicle depreciation over time</p>
            </div>
            <div className="h-80 bg-slate-900/50 rounded-xl p-6 border border-slate-700/30">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    )
}