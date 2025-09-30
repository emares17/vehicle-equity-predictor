import React, {useEffect, useRef} from "react"
import { Chart, registerables, Chart as ChartJS } from 'chart.js'
import type { ChartOptions, TooltipItem } from 'chart.js'
import { useLocation } from 'react-router-dom';
import { useVehicle } from '../../../context/VehicleDataContext'
import { useNavigate } from "react-router-dom";


Chart.register(...registerables);

export default function EquityTimeline() {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<ChartJS | null>(null);
    const { vehicleData, clearVehicleData } = useVehicle();
    const location = useLocation();
    const { prediction, userInputs, vehicleInfo } = location.state || {};
    const navigate = useNavigate();

    if (!vehicleData) {
        navigate('/');
        return null;
    }

    useEffect(() => {
        const labels: string[] = ['Now', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
        const future_value: number[] = [
            prediction.data.current_value,
            ...prediction.data.future_values.map((fv: { value: number }) => fv.value)
        ];

        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            // Need to add data for loan balance once implemented
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

            chartInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: chartOptions
            });

        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        }
    }, [prediction]);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-normal text-gray-900 mb-2">Equity Timeline</h2>
                {userInputs.has_loan ? (
                    <>
                        <p className="text-sm text-gray-600">Vehicle depreciation vs remaining loan balance over time</p>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-gray-600">Vehicle depreciation over time</p>
                    </>
                )}
            </div>
            <div className="h-80 bg-gray-100 rounded-lg p-4">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    )
}