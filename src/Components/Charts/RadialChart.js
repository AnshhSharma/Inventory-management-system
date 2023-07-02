import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './Chart.css'

const RadialChart = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fetch data from the API or database
    fetch('http://localhost:5000/orders')
      .then(response => response.json())
      .then(data => {
        let totalQuantity=0;
        let completedQuantity=0;
        data.forEach(element => {
          totalQuantity+=element.quantity;
          if(element.state === 'completed'){
            completedQuantity+=element.quantity;
          }
        });
        
        const progressPercentage = ((completedQuantity / totalQuantity) * 100).toFixed(2);
        setProgress(progressPercentage);
      })
      .catch(error => console.log(error));
  }, []);

  const chartOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -20,
      toolbar: {
        show: true,
        exportMenu: {
          csv: {
            fileName: 'radial-chart',
            exportData: {
              categoryHeader: 'Type',
              format: 'csv'
            }
          },
          png: {
            fileName: 'radial-chart',
            exportData: {
              categoryHeader: 'Type',
              format: 'png'
            }
          },
          svg: {
            fileName: 'radial-chart',
            exportData: {
              categoryHeader: 'Type',
              format: 'svg'
            }
          }
        }
      }
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '50%',
        },
        track: {
          margin: 10,
        },
        dataLabels: {
          show: true,
          name: {
            fontSize: '16px',
            color: undefined,
            offsetY: 30,
          },
          value: {
            fontSize: '28px',
            color: undefined,
            offsetY: -20,
          },
          total: {
            show: true,
            label: 'Orders Completed',
            fontSize: '16px',
            color: 'gray',
            offsetY: 50,
          },
        },
      },
    },
    colors: ['#0000FF'],
    labels: ['Completed'],
    series: [progress],
    stroke: {
      lineCap: 'round',
    },
  };

  return (
    <div  className='m-3 p-3' style={{border : '1px solid black' , width: '400px', height: '450px', borderRadius: '10px', backgroundColor: 'azure'}}>
      <ReactApexChart
        options={chartOptions}
        series={chartOptions.series}
        type="radialBar"
        height={350}
        />
        <span className='chart-heading'>Order Completion Progress</span>
    </div>
  );
};

export default RadialChart;
