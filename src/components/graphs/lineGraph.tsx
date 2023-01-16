import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

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
            size: 18,
            family: "system-ui"
          },
          color: "#FFFFFF"
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
        backgroundColor: "rgba(47, 97, 68, 0.3)",
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

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataPts,
        label: graphLabel
      }
    ]
  }
  
  return (
    <Line options={options} data={data} width={width} height={height}/>
  );
}

export default LineGraph;