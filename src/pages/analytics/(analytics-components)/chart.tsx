import * as React from 'react';
import { Line } from 'react-chartjs-2';

interface Data {
  labels: string[]; // Time labels x-axis
  datasets: [
    {
      label: string;
      data: number[];
      backgroundColor: string;
      borderWidth: number;
    },
  ];
}

const chartTypes = ["Price Prediction", "Sentiment Analysis", "General Price Data"];    //Top left selector of the chart 

const timeSeries = ["1h", "4h", "1d", "7d", "30d"];  //Top right dropdown of the chart

const Chart: React.FC = () => {
  const [data, setData] = React.useState<Data | null>(null);
  const [type, setType] = React.useState<string>('sentiment'); // Set the default type to 'sentiment'
  const [timeSeries, setTimeSeries] = React.useState<string>('1h'); // Set the default time series to '1h'

  const fetchData = async () => {
    const response = await fetch(`/api/chart-data?type=${type}&timeSeries=${timeSeries}`); // Fetch the data for the selectd type and time series
    //TBD: Route still needs configuring 
    const chartData = await response.json();
    setData(chartData);
  };

  React.useEffect(() => {
    fetchData();
  }, [type, timeSeries]); // Fetch the data again for the selected type and time series


  if (!data) {
    return <div>Loading...</div>;
    //Or set timeout then redirect
  }

  return (
    <div className="chart-container" style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', width: '800px', height: '600px', margin: '0 auto' }}>
      <div className="selectors display:flex justify-content: space-between" >
        <div className="type-selector display:flex">
          <select id="type-selector" onChange={e => setType(e.target.value)}>
            <option value="sentiment">Sentiment Analysis</option>
            <option value="price-prediction">Price Prediction</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className="time-series-selector display:flex">
          <select id="time-series-selector" onChange={e => setTimeSeries(e.target.value)}>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <Line data={data} />
    </div>
  );
}
//Line 61 will need further work on what data exactly gets to go on the graph. 
export default Chart;


/** If passed as props
const Chart: React.FC<Props> = ({ data }) => {
  return (
    <div className="chart-container">
      <Line data={data} />
    </div>
  );
};
*/