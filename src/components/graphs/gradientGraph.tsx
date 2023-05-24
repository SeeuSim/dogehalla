//WIP: There's no build-time error but data isn't being fed properly.
//For instructions on debugging, refer to https://react-chartjs-2.js.org/examples/gradient-chart/

import React, { useRef, useEffect, useState } from 'react';

import {
  Chart as ChartJS,
  ChartData,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartArea
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const colors = [
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'blue',
  'purple',
];

/*
const canvas = document.getElementById('graphLabel');
const ctx = (canvas as HTMLCanvasElement).getContext('2d');
let backgroundGradient = ctx?.createLinearGradient(0,0,0,400);
backgroundGradient.addColorStop(0, "rgba(58,123,213,1");
backgroundGradient.addColorStop(0, "rgba(0,210,255,0.3");


let width, height, gradient;
function getGradient(ctx, chartArea) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, '#0000FF');  //blue
    gradient.addColorStop(0.5, '#00FF00');  //red '#00FF00'
    gradient.addColorStop(1.0, '#FFFF00'); //green
  }

  return gradient;
}
*/
function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
  const colorStart = '#0000FF';
  const colorMid = '#00FF00';
  const colorEnd = '#FFFF00';

  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(0.5, colorMid);
  gradient.addColorStop(1, colorEnd);

  return gradient;
}

const LineGraph: React.FC<{
  width: number,
  height: number
  yCallback: (value: any, index: any, ticks: any) => string,
  graphLabel: string,
  labels: string[],
  dataPts: number[]
}> = ({ dataPts, graphLabel, labels, yCallback, width, height }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
            family: "system-ui"
          },
          color: "#64748b"
        },
        display: true
      }
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: "rgba(47, 97, 68, 1)",
        fill: "start",
        backgroundColor: "rgba(47, 97, 68, 1)",
      },
      point: {
        radius: 0,
        hitRadius: 0
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        min: 0,
        ticks: {
          callback: yCallback,
          color: "#64748b" 
        },
        labels: {
          font: {
            family: "system-ui"
          }
        }
      },
      x: {
        ticks: {
          color: "#64748b",
          autoSkip: true,
          maxTicksLimit: 7
        },
        label: {
          font: {
            family: "system-ui"
          }
        },
      }
    },
    interaction: {
      intersect: false,
      mode: "index" as const
    },
  };

  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [],
  });

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }
  
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: dataPts,
        label: graphLabel,
        
        borderColor: createGradient(chart.ctx, chart.chartArea),
        },
    
    ]
  };

  setChartData(chartData);
}, []);
  
  return (
    <Line options={options} data={chartData} width={width} height={height}/>
  );
}

export default LineGraph;